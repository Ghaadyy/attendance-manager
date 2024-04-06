using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AttendanceManagerAPI.Models;

public class CreateCourseModel
{
    [Required]
    [MinLength(4)]
    public required string Name { get; set; }

    [Required]
    public string? Description { get; set; }

    public IEnumerable<int>? TeacherIds { get; set; }
}