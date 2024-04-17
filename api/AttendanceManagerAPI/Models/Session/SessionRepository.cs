using System;

namespace AttendanceManagerAPI.Models;

public class SessionRepository : ISessionRepository
{
    private readonly AttendanceManagerContext context;
    private readonly ICourseRepository _courseRepository;

    public SessionRepository(AttendanceManagerContext context, ICourseRepository courseRepository)
    {
        this.context = context;
        this._courseRepository = courseRepository;
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

    public IEnumerable<Session> GetSessions(int courseId)
    {
        var sessions = from course in context.Courses
                       join session in context.Sessions on course.Id equals session.CourseId
                       where course.Id == courseId
                       select session;

        return sessions;
    }

    public IEnumerable<Session> GetSessions(int courseId, int pageIndex, int pageSize)
    {
        var sessions = (from course in context.Courses
                        join session in context.Sessions on course.Id equals session.CourseId
                        where course.Id == courseId
                        select session).Skip((pageIndex - 1) * pageSize).Take(pageSize);

        return sessions;
    }

    public bool HasMore(int courseId, int pageIndex, int pageSize)
        => (pageIndex * pageSize) < GetSessions(courseId).Count();

    public IEnumerable<User> GetStudents(int sessionId)
    {
        var students = from att in context.Attendance
                       join student in context.Users on att.StudentId equals student.Id
                       join session in context.Sessions on att.SessionId equals session.Id
                       where session.Id == sessionId
                       select student;

        return students;
    }

    public async Task<bool> AddStudent(Session session, int studentId)
    {
        if (_courseRepository.CheckIfStudentEnrolled(session.CourseId, studentId) is false) return false;

        Attendance attendance = new Attendance
        {
            StudentId = studentId,
            SessionId = session.Id,
            JoinDate = DateTime.UtcNow
        };

        context.Attendance.Add(attendance);

        await context.SaveChangesAsync();

        return true;
    }

    public bool IsStudentPresent(int sessionId, int studentId)
    {
        return context.Attendance
            .FirstOrDefault(att => att.StudentId == studentId && att.SessionId == sessionId)
            is not null;
    }

    public bool CheckIfSessionValid(Session session)
    {
        if (session.StartDate > DateTime.Now || session.EndDate < DateTime.Now)
        {
            return false;
        }

        return true;
    }
}

