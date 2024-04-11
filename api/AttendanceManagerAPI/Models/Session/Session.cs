using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AttendanceManagerAPI.Models;

[Table("sessions")]
public class Session
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [ForeignKey("Course")]
    [Column("course_id")]
    public required int CourseId { get; set; }

    [ForeignKey("Teacher")]
    [Column("teacher_id")]
    public required int TeacherId { get; set; }

    [Column("start_date")]
    public required DateTime StartDate { get; set; }

    [Column("end_date")]
    public required DateTime EndDate { get; set; }
}