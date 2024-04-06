using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AttendanceManagerAPI.Models;

[Table("attendance")]
public class Attendance
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [ForeignKey("Student")]
    [Column("student_id")]
    public required int StudentId { get; set; }

    [ForeignKey("Session")]
    [Column("session_id")]
    public required int SessionId { get; set; }

    [Column("join_date")]
    public required DateTime JoinDate { get; set; }
}