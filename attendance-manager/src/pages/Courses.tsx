import Card from "../components/Card";
import { Course } from "../models/Course";

function Courses() {
  const courses: Course[] = [
    {
      id: 1,
      name: "Web dynamique",
      description: "Reactive web",
    },
    {
      id: 2,
      name: "Principes des compilateurs",
      description: "Compiler construction",
    },
    {
      id: 3,
      name: "Design patterns",
      description: "Patterns of object oriented software",
    },
  ];

  return (
    <>
      <h1 className="text-xl font-bold text-gray-800">Courses</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-5">
        {courses.map((course) => (
          <Card
            name={course.name}
            text={course.description}
            actionName="Go to course"
            actionPath="/course"
          />
        ))}
      </div>
    </>
  );
}

export default Courses;
