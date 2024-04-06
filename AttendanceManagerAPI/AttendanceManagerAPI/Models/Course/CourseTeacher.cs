using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AttendanceManagerAPI.Models;

[Table("course_teacher")]
public class CourseTeacher
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [ForeignKey("Teacher")]
    [Column("teacher_id")]
    public required int TeacherId { get; set; }

    [ForeignKey("Course")]
    [Column("course_id")]
    public required int CourseId { get; set; }
}