import { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import { Course } from "../models/Course";
import { userContext } from "../store/UserContext";

function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);

  const { user, token } = useContext(userContext);

  useEffect(() => {
    fetch("http://localhost:8000/api/courses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json().then((data) => setCourses(data)))
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <>
      <h1 className="text-xl font-bold text-gray-800">Courses</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-5">
        {courses.map((course) => (
          <Card
            name={course.name}
            text={course.description}
            actionName="Go to course"
            actionPath={`/course/${course.id}`}
          />
        ))}
      </div>
    </>
  );
}

export default Courses;
