using System;
using System.ComponentModel.DataAnnotations;

namespace AttendanceManagerAPI.Models;

public class PartialUser
{
    [MinLength(3)]
    public string? FirstName { get; set; }

    [MinLength(3)]
    public string? LastName { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    [MinLength(3)]
    public string? UserName { get; set; }

    public DateOnly? BirthDate { get; set; }

    [Phone]
    public string? PhoneNumber { get; set; }

    [MinLength(6)]
    public string? Password { get; set; }

    [RegularExpression("(AB|[ABO])[+-]?", ErrorMessage = "Please enter a valid blood type.")]
    public string? BloodType { get; set; }
}