namespace AttendanceManagerAPI.Models.Requirements;

public class BridgeEnrolledRequirement : IUserEnrolledRequirement
{
    private UserEnrolledRequirement _requirement;
    private readonly ICourseRepository _courseRepository;

    private string Role;
    private int CourseId;
    private int UserId;
    public BridgeEnrolledRequirement(ICourseRepository courseRepository, int courseId, int userId, string role)
    {
        Role = role;
        CourseId = courseId;
        UserId = userId;
        _courseRepository = courseRepository;

        _requirement = new StudentEnrolledRequirement(courseRepository, courseId, userId, role);
    }

    public bool Succeed()
    {
        if (IsAdmin()) return true;

        if(Role == "Teacher")
        {
            _requirement = new TeacherEnrolledRequirement(_courseRepository, UserId, CourseId, Role);
        }
        else
        {
            _requirement = new StudentEnrolledRequirement(_courseRepository, UserId, CourseId, Role);
        }

        return _requirement.Succeed();
    }

    public bool IsAdmin()
    {
        return _requirement.IsAdmin();
    }
}
