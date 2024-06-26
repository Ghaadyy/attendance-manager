import { useContext, useEffect, useState } from "react";
import { Session } from "../../../models/Session";
import CreateSessionModal from "../../modals/CreateSessionModal";
import TableRow from "./SessionTableRow";
import { userContext } from "../../../store/UserContext";
import QRScanModal from "../../modals/QRScanModal";

type TableProps = {
  courseId: number;
};

function SessionsTable({ courseId }: TableProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { user, token } = useContext(userContext);

  useEffect(() => {
    const pageSize = 5;

    fetch(
      `${process.env.REACT_APP_API_URL}/courses/${courseId}/sessions?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((res) =>
        res.json().then((data) => {
          const { list: sessions, hasMore } = data;
          setSessions(sessions);
          setHasMore(hasMore);
        })
      )
      .catch((err) => console.log(err));
  }, [token, courseId, pageIndex, isOpen]);

  const onCreateSession = (session: Session) => {
    setSessions((sessions) => [...sessions, session]);
  };

  function ScanQRIcon() {
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
        className="flex-shrink-0 size-4"
      >
        <path d="M3 7V5a2 2 0 0 1 2-2h2" />
        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <path d="M7 12h10" />
      </svg>
    );
  }

  return (
    <>
      <CreateSessionModal courseId={courseId} onCreate={onCreateSession} />
      <QRScanModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      {/* <!-- Table Section --> */}
      <div className="max-w-[85rem] px-4 py-10 mx-auto">
        {/* <!-- Card --> */}
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* <!-- Header --> */}
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Sessions
                    </h2>
                    <p className="text-sm text-gray-600">
                      Add sessions, edit and more.
                    </p>
                  </div>

                  <div>
                    <div className="inline-flex gap-x-2">
                      {user?.roles?.includes("Administrator") && (
                        <button
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                          type="button"
                          data-hs-overlay="#hs-basic-modal"
                        >
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
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                          </svg>
                          Create session
                        </button>
                      )}
                      <button
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        type="button"
                        data-hs-overlay="#qr-scan-modal"
                        onClick={() => {
                          setIsOpen(true);
                        }}
                      >
                        <ScanQRIcon />
                        Scan QR
                      </button>
                    </div>
                  </div>
                </div>
                {/* <!-- End Header --> */}

                {/* <!-- Table --> */}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* <th scope="col" className="ps-6 py-3 text-start"></th> */}
                      <th scope="col" className="ps-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
                            Name
                          </span>
                        </div>
                      </th>

                      <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
                            Start
                          </span>
                        </div>
                      </th>

                      <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
                            End
                          </span>
                        </div>
                      </th>

                      <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
                            Description
                          </span>
                        </div>
                      </th>

                      {user?.roles?.includes("Student") && (
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
                              Status
                            </span>
                          </div>
                        </th>
                      )}

                      <th scope="col" className="px-6 py-3 text-end"></th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {sessions.map((s) => (
                      <TableRow
                        key={s.id}
                        session={s}
                        onDelete={(sessionId) =>
                          setSessions((prevSessions) =>
                            prevSessions.filter(
                              (session) => session.id !== sessionId
                            )
                          )
                        }
                      />
                    ))}
                  </tbody>
                </table>
                {/* <!-- End Table --> */}

                {/* <!-- Footer --> */}
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">
                        {sessions.length}
                      </span>{" "}
                      {sessions.length === 1 ? "result" : "results"}
                    </p>
                  </div>

                  <div>
                    <div className="inline-flex gap-x-2">
                      <button
                        type="button"
                        disabled={pageIndex === 1}
                        onClick={() =>
                          setPageIndex((idx) => (idx - 1 === 0 ? 1 : idx - 1))
                        }
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      >
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
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                        Prev
                      </button>

                      <button
                        type="button"
                        disabled={!hasMore}
                        onClick={() => setPageIndex((idx) => idx + 1)}
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Next
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
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                {/* <!-- End Footer --> */}
              </div>
            </div>
          </div>
        </div>
        {/* <!-- End Card --> */}
      </div>
      {/* <!-- End Table Section --> */}
    </>
  );
}

export default SessionsTable;
