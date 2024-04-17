using System;

namespace AttendanceManagerAPI.Models;

public interface ISessionRepository
{
    Session? GetSession(int sessionId);
    IEnumerable<Session> GetSessions();
    IEnumerable<Session> GetSessions(int courseId);
    IEnumerable<Session> GetSessions(int courseId, int pageIndex, int pageSize);
    bool HasMore(int courseId, int pageIndex, int pageSize);
    Task AddSession(Session session);
    //Task EditSession(Session session);
    Task DeleteSession(Session session);
    IEnumerable<User> GetStudents(int sessionId);
    Task<bool> AddStudent(Session session, int studentId);
    bool CheckIfSessionValid(Session session);
    bool IsStudentPresent(int sessionId, int studentId);
}