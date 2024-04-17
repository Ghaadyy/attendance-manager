using System;
namespace AttendanceManagerAPI.Models;

public class PaginatedSessionList
{
    public required IEnumerable<Session> sessions;
    public required bool hasMore;
}