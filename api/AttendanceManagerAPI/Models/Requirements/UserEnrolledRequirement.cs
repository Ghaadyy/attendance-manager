namespace AttendanceManagerAPI.Models.Requirements;

public abstract class UserEnrolledRequirement : IUserEnrolledRequirement
{
	protected readonly ICourseRepository _courseRepository;
	protected int UserId { get; set; }
	protected int CourseId { get; set; }
	protected bool isAdmin { get; set; }

	public UserEnrolledRequirement(ICourseRepository courseRepository, int courseId, int userId, string role)
	{
		_courseRepository = courseRepository;
		UserId = userId;
		CourseId = courseId;

		if (role == "Administrator") isAdmin = true;
	}

	public abstract bool Succeed();
	public bool IsAdmin()
	{
		return isAdmin;
	}
}
