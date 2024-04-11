using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace AttendanceManagerAPI.Models;

public class AttendanceManagerContext : DbContext
{
    public AttendanceManagerContext(DbContextOptions options) : base(options)
    { }

    public DbSet<User> Users { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Session> Sessions { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Attendance> Attendance { get; set; }
    public DbSet<CourseStudent> CourseStudent { get; set; }
    public DbSet<CourseTeacher> CourseTeacher { get; set; }
}