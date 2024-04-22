import { toast } from "react-toastify";
import { User } from "../../../models/User";
import { useContext, useState } from "react";
import { userContext } from "../../../store/UserContext";

type TableRowProps = {
  user: User;
  status: boolean;
  courseId: number;
  sessionId: number;
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

function AbsentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="size-2.5"
    >
      <line x1="9" x2="15" y1="15" y2="9" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function StudentSessionTableRow({
  user,
  status: userStatus,
  courseId,
  sessionId,
}: TableRowProps) {
  const { token } = useContext(userContext);

  const [status, setStatus] = useState<boolean>(userStatus);

  if (user === null) return null;

  const {
    firstName,
    lastName,
    birthDate,
    email,
    roles,
    bloodType,
    phoneNumber,
  } = user;

  const markAttendance = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/courses/${courseId}/sessions/${sessionId}/attendance/${user.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    ).then(async (res) => {
      if (res.ok) {
        toast.success("Marked as present!", {
          toastId: res.status,
        });
        setStatus(true);
      } else {
        toast.error(await res.text(), {
          toastId: res.status,
        });
        setStatus(false);
      }
    }).catch((err) => console.log(err));
  };

  return (
    <tr>
      <td className="size-px whitespace-nowrap">
        <div className="ps-6 py-3">
          <div className="flex items-center gap-x-3">
            <div className="grow">
              <span className="block text-sm font-semibold text-gray-800">
                {firstName + " " + lastName}
              </span>
              <span className="block text-sm text-gray-500">{email}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="h-px w-52 whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="block text-sm font-semibold text-gray-800">
            {roles ? roles.join(", ") : "N/A"}
          </span>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="text-sm text-gray-500">
            {birthDate ? new Date(birthDate).toDateString() : "N/A"}
          </span>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="text-sm text-gray-500">{phoneNumber ?? "N/A"}</span>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="text-sm text-gray-500">{bloodType ?? "N/A"}</span>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span
            className={`py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium ${
              status ? "bg-teal-100 text-teal-800" : "bg-red-100 text-red-800"
            } rounded-full`}
          >
            {status ? <TickIcon /> : <AbsentIcon />}
            {status ? "Present" : "Absent"}
          </span>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-1.5 inline-flex flex-col gap-2">
          <div className="inline-flex rounded-lg shadow-sm">
            <button
              type="button"
              disabled={status}
              onClick={markAttendance}
              className="py-2 px-3 inline-flex justify-center items-center gap-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              Mark Attendance
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default StudentSessionTableRow;
