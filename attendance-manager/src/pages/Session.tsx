import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../store/UserContext";
import { Session } from "../models/Session";
import StudentSessionTable from "../components/tables/sessions/StudentSessionTable";

function SessionPage() {
  const { token } = useContext(userContext);

  const { courseId, sessionId } = useParams();

  if (!courseId || !sessionId) throw new Error("404 not found");

  const [session, setSession] = useState<Session>();

  useEffect(() => {
    fetch(
      `http://localhost:8000/api/courses/${courseId}/sessions/${sessionId}`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
      .then((res) => res.json().then((data) => setSession(data)))
      .catch((err) => console.log(err));
  }, [token, courseId, sessionId]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800">{session?.name}</h1>
      <p>{session?.description}</p>

      <StudentSessionTable
        courseId={Number.parseInt(courseId)}
        sessionId={Number.parseInt(sessionId)}
      />
    </div>
  );
}

export default SessionPage;
