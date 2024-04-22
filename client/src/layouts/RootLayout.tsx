import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import NavItem from "../components/navigation/NavItem";
import Avatar from "../components/avatars/Avatar";
import { userContext } from "../store/UserContext";

function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useContext(userContext);

  const [pageName, setPageName] = useState("");

  useEffect(() => {
    window.HSStaticMethods.autoInit();
    const pathname = location.pathname;
    const trimmedPathname = pathname.replace("/", "");
    setPageName(trimmedPathname === "" ? "Dashboard" : trimmedPathname);
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white border-b text-sm py-2.5 sm:py-4 lg:ps-64">
        <nav
          className="flex basis-full items-center w-full mx-auto px-4 sm:px-6 md:px-8"
          aria-label="Global"
        >
          <div className="me-5 lg:me-0 lg:hidden">
            <Link className="flex-none text-xl font-semibold" to="/">
              Attendance Manager
            </Link>
          </div>

          <div className="w-full flex items-center justify-end ms-auto sm:gap-x-3 sm:order-3">
            {/* Dropdown avatar */}
            <div className="flex flex-row items-center justify-end gap-2">
              <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                <button
                  id="hs-dropdown-with-header"
                  type="button"
                  className="inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Avatar />
                </button>
                <div
                  className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2"
                  aria-labelledby="hs-dropdown-with-header"
                >
                  <div className="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-800">
                      {user?.email}
                    </p>
                  </div>
                  <div className="mt-2 py-2 first:pt-0 last:pb-0">
                    <Link
                      className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                      to="/account"
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
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Account
                    </Link>
                    <button
                      className="flex items-center w-full gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                      onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/auth/login");
                      }}
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
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                      </svg>
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile breadcrumbs */}
      <div className="sticky top-0 inset-x-0 z-20 bg-white border-y px-4 sm:px-6 md:px-8 lg:hidden">
        <div className="flex items-center py-4">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            data-hs-overlay="#application-sidebar"
            aria-controls="application-sidebar"
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle Navigation</span>
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
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </button>

          <ol className="ms-3 flex items-center whitespace-nowrap">
            <li className="flex items-center text-sm text-gray-800">
              Attendance Manager
              <svg
                className="flex-shrink-0 mx-3 overflow-visible size-2.5 text-gray-400"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </li>
            <li
              className="text-sm font-semibold text-gray-800 truncate"
              aria-current="page"
            >
              {pageName}
            </li>
          </ol>
        </div>
      </div>

      {/* Navbar */}
      <div
        id="application-sidebar"
        className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        <div className="px-6">
          <Link className="flex-none text-xl font-semibold" to="/">
            Attendance Manager
          </Link>
        </div>

        <nav
          className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
          data-hs-accordion-always-open
        >
          <ul className="space-y-1.5">
            <NavItem path="/courses" name="Courses" />
            {user?.roles?.includes("Administrator") && (
              <NavItem path="/course/create" name="Create Courses" />
            )}
            {user?.roles?.includes("Administrator") && (
              <NavItem path="/users" name="Users" />
            )}
          </ul>
        </nav>
      </div>

      <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
        <div className="w-full h-full overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default RootLayout;
