import { toast } from "react-toastify";
import { Session } from "../../../models/Session";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../../../store/UserContext";

type TableRowProps = {
  session: Session;
  onDelete: (sessionId: number) => void;
};

function TickIcon() {
  return (
    <svg
      className="size-2.5"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
    </svg>
  );
}

function SessionTableRow({ session, onDelete }: TableRowProps) {
  const { user, token } = useContext(userContext);

  const handleDelete = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/courses/${session.courseId}/sessions/${session.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (res.ok) {
      onDelete(session.id);
      toast.success("Session deleted successfully", {
        toastId: res.status,
      });
    } else {
      toast.error("Could not delete session", {
        toastId: res.status,
      });
    }
  };

  return (
    <tr>
      <td className="size-px whitespace-nowrap">
        <div className="ps-6 py-3">
          <div className="flex items-center gap-x-3">
            <div className="grow">
              <span className="block text-sm font-semibold text-gray-800">
                {session.name}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="text-sm text-gray-500">
            {new Date(session.startDate).toDateString()}
          </span>
          <br />
          <span className="text-sm text-gray-500">
            {new Date(session.startDate).toLocaleTimeString()}
          </span>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="text-sm text-gray-500">
            {new Date(session.endDate).toDateString()}
          </span>
          <br />
          <span className="text-sm text-gray-500">
            {new Date(session.endDate).toLocaleTimeString()}
          </span>
        </div>
      </td>
      <td className="h-px w-72 whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="block text-sm font-semibold text-gray-800">
            {session.description}
          </span>
        </div>
      </td>
      {/* <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full">
            <TickIcon />
            Present
          </span>
        </div>
      </td> */}
      {(user?.roles?.includes("Administrator") || user?.roles?.includes("Teacher")) &&
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-1.5 inline-flex flex-col gap-2">
          <div className="inline-flex rounded-lg shadow-sm">
            <Link
              to={`/course/${session.courseId}/session/${session.id}`}
              type="button"
              className="py-2 px-3 inline-flex justify-center items-center gap-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              View
            </Link>
            <button
              onClick={handleDelete}
              type="button"
              className="py-2 px-3 inline-flex justify-center items-center gap-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              Delete
            </button>
          </div>
        </div>
      </td>}
    </tr>
  );
}

export default SessionTableRow;
