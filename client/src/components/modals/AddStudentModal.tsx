import { useContext, useState } from "react";
import { userContext } from "../../store/UserContext";
import { toast } from "react-toastify";
import { User } from "../../models/User";

type AddStudentModalProps = {
  courseId: number;
  onCreate: (user: User) => void;
};

function AddStudentModal({ courseId, onCreate }: AddStudentModalProps) {
  const [username, setUsername] = useState<string>("");

  const { token } = useContext(userContext);

  const resetForms = () => {
    setUsername("");
  };

  const submitHandler = async () => {
    if (username === "") {
      toast.error("Username required", {
        toastId: 400,
      });
      return;
    }
    await fetch(
      `${process.env.REACT_APP_API_URL}/courses/${courseId}/students/${username}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then(async (res) => {
        if (res.ok) {
          resetForms();
          toast.success("Student Added", {
            toastId: res.status,
          });

          const student: User = await res.json();

          onCreate(student);
        } else {
          toast.error(await res.text(), {
            toastId: res.status,
          });
        }
      })
      .catch(() => {
        toast.error("Could not send request", {
          toastId: 500,
        });
      });
  };

  return (
    <div
      id="add-student-modal"
      className="hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-[80] opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none"
    >
      <div className="sm:max-w-lg sm:w-full m-3 sm:mx-auto">
        <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto">
          <div className="flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-bold text-gray-800">Add a student</h3>
            <button
              type="button"
              className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              data-hs-overlay="#add-student-modal"
            >
              <span className="sr-only">Close</span>
              <svg
                className="flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
          <div className="p-4 overflow-y-auto">
            <form>
              <div className="sm:col-span-3">
                <label
                  htmlFor="student_username"
                  className="inline-block text-sm text-gray-800 mt-2.5"
                >
                  Username
                </label>
              </div>
              <div className="sm:col-span-9">
                <input
                  id="student_username"
                  type="text"
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="najib"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
            <button
              type="button"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              data-hs-overlay="#add-student-modal"
            >
              Close
            </button>
            <button
              type="button"
              onClick={submitHandler}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStudentModal;
