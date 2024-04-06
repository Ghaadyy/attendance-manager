using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AttendanceManagerAPI.Models;

[Table("user_role")]
public class UserRole
{
    [Key]
    [Column("id")]
    public int Id { get; set; }
    [Column("user_id")]
    public required int UserId { get; set; }
    [Column("role_id")]
    public required int RoleId { get; set; }
}