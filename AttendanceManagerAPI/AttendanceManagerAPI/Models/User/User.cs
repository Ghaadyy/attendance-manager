using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AttendanceManagerAPI.Models;

[Table("users")]
public class User
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("first_name")]
    public required string FirstName { get; set; }

    [Column("last_name")]
    public required string LastName { get; set; }

    [Column("email")]
    public required string Email { get; set; }

    [Column("user_name")]
    public required string UserName { get; set; }

    [Column("dob")]
    public DateOnly? BirthDate { get; set; }

    [Column("phone_number")]
    public string? PhoneNumber { get; set; }

    [Column("password")]
    public required string Password { get; set; }

    [Column("blood_type")]
    public string? BloodType { get; set; }
}