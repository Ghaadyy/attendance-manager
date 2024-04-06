using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AttendanceManagerAPI.Models;

[Table("roles")]
public class Role
{
    [Key]
    [Column("id")]
    public int Id { get; set; }
    [Column("name")]
    public required string Name { get; set; }
}