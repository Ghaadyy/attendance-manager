using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AttendanceManagerAPI.Models;

public class CreateSessionModel
{
    [Required]
    public required int CourseId { get; set; }

    [Required]
    public required int TeacherId { get; set; }

    [Required]
    public required DateTime StartDate { get; set; }

    [Required]
    public required DateTime EndDate { get; set; }
}