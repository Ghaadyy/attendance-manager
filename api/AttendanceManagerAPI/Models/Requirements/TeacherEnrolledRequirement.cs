namespace AttendanceManagerAPI.Models.Requirements;

public class TeacherEnrolledRequirement : UserEnrolledRequirement
{
    public TeacherEnrolledRequirement(ICourseRepository courseRepository, int userId, int courseId, string role) : base(courseRepository, userId, courseId, role)
    {

    }

    public override bool Succeed()
    {
        return IsAdmin() | _courseRepository.CheckIfTeacherEnrolled(CourseId, UserId);
    }
}
