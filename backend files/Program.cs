using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Dtos;
using WebApplication1.Interfaces;
using WebApplication1.Models;
using WebApplication1.Repositories;
using WebApplication1.Services;
using WebApplication1.Validators;

var builder = WebApplication.CreateBuilder(args);

// 1. FluentValidation ve Json Serializer ayarlar�
builder.Services.AddControllers()
    .AddFluentValidation(fv =>
    {
        fv.RegisterValidatorsFromAssemblyContaining<CreatePointDtoValidator>();
        // �stersen di�er DTO validatorlar�n� da buraya ekle
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.NumberHandling =
            System.Text.Json.Serialization.JsonNumberHandling.AllowNamedFloatingPointLiterals;
    });

// 2. PostgreSQL ba�lant�s� ve NetTopologySuite kullan�m�
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
                      x => x.UseNetTopologySuite()));

// 3. CORS Policy tan�m� - T�m originlere izin veriliyor (geli�tirme ortam� i�in)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// 4. Servis kay�tlar� (generic interface 3 parametreli)
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// *** Burada 3 parametreli generic interface kullan�l�yor ***
builder.Services.AddScoped<IApiService<Point, CreatePointDto, UpdatePointDto>, PointService>();
builder.Services.AddScoped<IApiService<LineEntity, CreateLineDto, UpdateLineDto>, LineService>();
builder.Services.AddScoped<IApiService<PolygonEntity, CreatePolygonDto, UpdatePolygonDto>, PolygonService>();

// Di�er repository�lerin varsa onlar� da buraya eklemeyi unutma
builder.Services.AddScoped<IPointRepository, PointRepository>();
builder.Services.AddScoped<ILineRepository, LineRepository>();
builder.Services.AddScoped<IPolygonRepository, PolygonRepository>();

builder.Services.AddEndpointsApiExplorer();

// Swagger'da schemaId �ak��malar�n� �nlemek i�in
builder.Services.AddSwaggerGen(c =>
{
    c.CustomSchemaIds(type => type.FullName.Replace("+", "."));
});

var app = builder.Build();

// Middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS middleware kullan�m� - mutlaka UseRouting �ncesi olmal�
app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
