using System;
namespace AttendanceManagerAPI.Models;

public class AttendanceUser
{
    public required User User;
    public required bool Status;
}

public class PaginatedAttendanceUserList
{
    public required IEnumerable<AttendanceUser> Users;
    public required bool HasMore;
}