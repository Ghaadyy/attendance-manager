using System;

namespace AttendanceManagerAPI.Models;

public interface ISessionRepository
{
    Session? GetSession(int sessionId);
    IEnumerable<Session> GetSessions();
    Task AddSession(Session session);
    //Task EditSession(Session session);
    Task DeleteSession(Session session);
    IEnumerable<User> GetStudents(int sessionId);
}