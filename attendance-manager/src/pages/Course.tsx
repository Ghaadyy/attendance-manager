import { useParams } from "react-router-dom";
import SessionsTable from "../components/tables/sessions/SessionsTable";
import { useContext, useEffect, useState } from "react";
import { Course as CourseModel } from "../models/Course";
import { User } from "../models/User";
import { userContext } from "../store/UserContext";
import StudentsTable from "../components/tables/users/StudentsTable";
import TeachersTable from "../components/tables/users/TeachersTable";

function Course() {
  const { token } = useContext(userContext);

  const { courseId } = useParams();

  if (!courseId) throw new Error("404 not found");

  const [course, setCourse] = useState<CourseModel>();
  const [teachers, setTeachers] = useState<User[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/courses/${courseId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json().then((data) => setCourse(data)))
      .catch((err) => console.log(err));

    fetch(`http://localhost:8000/api/courses/${courseId}/teachers/all`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json().then((data) => setTeachers(data)))
      .catch((err) => console.log(err));
  }, [token, courseId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800">{course?.name}</h1>
      <p>{course?.description}</p>
      <br />
      <p className="font-bold">
        Teachers:{" "}
        <span className="font-normal">
          {teachers.length !== 0
            ? teachers
                .map((teachers) => teachers.firstName + " " + teachers.lastName)
                .join(", ")
            : "None"}
        </span>
      </p>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-1" aria-label="Tabs" role="tablist">
          <button
            type="button"
            className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none active"
            id="tabs-with-underline-item-1"
            data-hs-tab="#tabs-with-underline-1"
            aria-controls="tabs-with-underline-1"
            role="tab"
          >
            Sessions
          </button>
          <button
            type="button"
            className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none"
            id="tabs-with-underline-item-2"
            data-hs-tab="#tabs-with-underline-2"
            aria-controls="tabs-with-underline-2"
            role="tab"
          >
            Students
          </button>
          <button
            type="button"
            className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none"
            id="tabs-with-underline-item-3"
            data-hs-tab="#tabs-with-underline-3"
            aria-controls="tabs-with-underline-3"
            role="tab"
          >
            Teachers
          </button>
        </nav>
      </div>
      <div
        id="tabs-with-underline-1"
        role="tabpanel"
        aria-labelledby="tabs-with-underline-item-1"
      >
        <SessionsTable courseId={Number.parseInt(courseId)} />
      </div>
      <div
        id="tabs-with-underline-2"
        className="hidden"
        role="tabpanel"
        aria-labelledby="tabs-with-underline-item-2"
      >
        <StudentsTable courseId={Number.parseInt(courseId)} />
      </div>
      <div
        id="tabs-with-underline-3"
        className="hidden"
        role="tabpanel"
        aria-labelledby="tabs-with-underline-item-3"
      >
        <TeachersTable courseId={Number.parseInt(courseId)} />
      </div>
    </div>
  );
}

export default Course;
