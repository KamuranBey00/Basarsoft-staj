using FluentValidation;
using WebApplication1.Dtos;
using System.Globalization;

namespace WebApplication1.Validators
{
    public class CreatePointDtoValidator : AbstractValidator<CreatePointDto>
    {
        public CreatePointDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required.");

            RuleFor(x => x.PointX)
                .NotEmpty().WithMessage("PointX is required.")
                .Must(BeValidDouble).WithMessage("PointX must be a valid number.");

            RuleFor(x => x.PointY)
                .NotEmpty().WithMessage("PointY is required.")
                .Must(BeValidDouble).WithMessage("PointY must be a valid number.");
        }

        private bool BeValidDouble(string val)
        {
            return double.TryParse(val, NumberStyles.Float, CultureInfo.InvariantCulture, out _);
        }
    }
}
