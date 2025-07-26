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

// 1. FluentValidation ve Json Serializer ayarlarý
builder.Services.AddControllers()
    .AddFluentValidation(fv =>
    {
        fv.RegisterValidatorsFromAssemblyContaining<CreatePointDtoValidator>();
        // Ýstersen diðer DTO validatorlarýný da buraya ekle
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.NumberHandling =
            System.Text.Json.Serialization.JsonNumberHandling.AllowNamedFloatingPointLiterals;
    });

// 2. PostgreSQL baðlantýsý ve NetTopologySuite kullanýmý
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
                      x => x.UseNetTopologySuite()));

// 3. CORS Policy tanýmý - Tüm originlere izin veriliyor (geliþtirme ortamý için)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// 4. Servis kayýtlarý (generic interface 3 parametreli)
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// *** Burada 3 parametreli generic interface kullanýlýyor ***
builder.Services.AddScoped<IApiService<Point, CreatePointDto, UpdatePointDto>, PointService>();
builder.Services.AddScoped<IApiService<LineEntity, CreateLineDto, UpdateLineDto>, LineService>();
builder.Services.AddScoped<IApiService<PolygonEntity, CreatePolygonDto, UpdatePolygonDto>, PolygonService>();

// Diðer repository’lerin varsa onlarý da buraya eklemeyi unutma
builder.Services.AddScoped<IPointRepository, PointRepository>();
builder.Services.AddScoped<ILineRepository, LineRepository>();
builder.Services.AddScoped<IPolygonRepository, PolygonRepository>();

builder.Services.AddEndpointsApiExplorer();

// Swagger'da schemaId çakýþmalarýný önlemek için
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

// CORS middleware kullanýmý - mutlaka UseRouting öncesi olmalý
app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
