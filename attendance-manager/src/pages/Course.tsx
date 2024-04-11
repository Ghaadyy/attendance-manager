import SessionsTable from "../components/tables/sessions/SessionsTable";

function Course() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800">
        Principes des compilateurs
      </h1>
      <SessionsTable />
    </div>
  );
}

export default Course;
