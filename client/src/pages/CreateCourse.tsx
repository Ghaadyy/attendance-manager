import { useContext, useState } from "react";
import { userContext } from "../store/UserContext";
import { toast } from "react-toastify";

function CreateCourse() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { token } = useContext(userContext);

  const resetForms = () => {
    setName("");
    setDescription("");
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();

    if (name === "" || description === "") {
      toast.warning("Empty input detected", {
        toastId: 400,
      });
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name,
        description,
      }),
    })
      .then(async (res) => {
        if (res.ok) {
          resetForms();
          toast.success("Course created", {
            toastId: res.status,
          });
        } else {
          toast.error(await res.text(), {
            toastId: 401,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="bg-white rounded-xl shadow">
        <div className="pt-0 p-4 sm:pt-0 sm:p-7">
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="af-submit-app-course-name"
                className="inline-block text-sm font-medium text-gray-800 mt-2.5"
              >
                Course name
              </label>

              <input
                id="af-submit-app-course-name"
                type="text"
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="Enter course name"
                minLength={4}
                required
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="af-submit-app-description"
                className="inline-block text-sm font-medium text-gray-800 mt-2.5"
              >
                Description
              </label>

              <textarea
                id="af-submit-app-description"
                className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                rows={6}
                required
                placeholder="A detailed summary about the course's contents."
                value={description}
                onChange={(ev) => setDescription(ev.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="mt-5 flex justify-center gap-x-2">
            <button
              type="submit"
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Create course
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CreateCourse;
