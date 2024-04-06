using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AttendanceManagerAPI.Models;

[Table("course_student")]
public class CourseStudent
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [ForeignKey("Student")]
    [Column("student_id")]
    public required int StudentId { get; set; }

    [ForeignKey("Course")]
    [Column("course_id")]
    public required int CourseId { get; set; }
}