using System;
namespace AttendanceManagerAPI.Models;

public class AttendanceUser
{
    public required User User;
    public required bool Status;
}