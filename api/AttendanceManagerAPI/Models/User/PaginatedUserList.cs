using System;
namespace AttendanceManagerAPI.Models;

public class PaginatedUserList
{
    public required IEnumerable<User> users;
    public required bool hasMore;
}