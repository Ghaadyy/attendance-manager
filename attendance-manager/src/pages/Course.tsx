import { useParams } from "react-router-dom";
import SessionsTable from "../components/tables/sessions/SessionsTable";
import { useEffect, useState } from "react";
import { Course as CourseModel } from "../models/Course";
import { Session } from "../models/Session";
import { User } from "../models/User";

function Course() {
  const { courseId } = useParams();

  if (!courseId) throw new Error("404 not found");

  const [course, setCourse] = useState<CourseModel>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/courses/${courseId}`)
      .then((res) => res.json().then((data) => setCourse(data)))
      .catch((err) => console.log(err));

    fetch(`http://localhost:8000/api/courses/${courseId}/sessions`)
      .then((res) => res.json().then((data) => setSessions(data)))
      .catch((err) => console.log(err));

    fetch(`http://localhost:8000/api/courses/${courseId}/teachers`)
      .then((res) => res.json().then((data) => setTeachers(data)))
      .catch((err) => console.log(err));
  }, []);

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
      <SessionsTable sessions={sessions} courseId={Number.parseInt(courseId)} />
    </div>
  );
}

export default Course;
