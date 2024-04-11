namespace AttendanceManagerAPI.Models.Requirements;

public class TeacherEnrolledRequirement : UserEnrolledRequirement
{
    public TeacherEnrolledRequirement(ICourseRepository courseRepository, int courseId, int userId, string role) : base(courseRepository, courseId, userId, role)
    {

    }

    public override bool Succeed()
    {
        return IsAdmin() | _courseRepository.CheckIfTeacherEnrolled(CourseId, UserId);
    }
}
