import { useParams } from "react-router-dom";
import SessionsTable from "../components/tables/sessions/SessionsTable";

function Course() {
  const { courseId } = useParams();

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800">
        Principes des compilateurs {courseId}
      </h1>
      <SessionsTable />
    </div>
  );
}

export default Course;
