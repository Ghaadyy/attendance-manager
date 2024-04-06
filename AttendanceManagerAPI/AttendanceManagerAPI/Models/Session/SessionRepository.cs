using System;

namespace AttendanceManagerAPI.Models;

public class SessionRepository : ISessionRepository
{
    private readonly AttendanceManagerContext context;

    public SessionRepository(AttendanceManagerContext context)
    {
        this.context = context;
    }

    public async Task AddSession(Session session)
    {
        context.Sessions.Add(session);
        await context.SaveChangesAsync();
    }

    public async Task DeleteSession(Session session)
    {
        context.Sessions.Remove(session);
        await context.SaveChangesAsync();
    }

    //public Task EditSession(Session session)
    //{
    //    throw new NotImplementedException();
    //}

    public Session? GetSession(int sessionId)
    {
        return context.Sessions.FirstOrDefault(s => s.Id == sessionId);
    }

    public IEnumerable<Session> GetSessions()
    {
        return context.Sessions;
    }

    public IEnumerable<User> GetStudents(int sessionId)
    {
        var students = from att in context.Attendance
                       join student in context.Users on att.StudentId equals student.Id
                       join session in context.Sessions on att.SessionId equals session.Id
                       where session.Id == sessionId
                       select student;

        return students;
    }
}

