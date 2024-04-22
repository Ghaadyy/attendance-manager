import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import "preline/preline";
import { IStaticMethods } from "preline/preline";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";
import RootLayout from "./layouts/RootLayout";
import Account from "./pages/Account";
import Courses from "./pages/Courses";
import Course from "./pages/Course";
import Users from "./pages/Users";
import CreateCourse from "./pages/CreateCourse";
import CreateUser from "./pages/CreateUser";
import { Provider as UserProvider } from "./store/UserContext";
import { useEffect, useState } from "react";
import { User } from "./models/User";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import EditUser from "./pages/EditUser";
import SessionPage from "./pages/Session";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

function App() {
  const stToken = localStorage.getItem("token");
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string | undefined>(stToken ?? undefined);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decodedToken: any = jwtDecode(storedToken);

      const { exp } = decodedToken;
      setToken(storedToken);

      if (!exp || exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        setToken(undefined);
        setUser(undefined);
      } else {
        fetch(`${process.env.REACT_APP_API_URL}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + storedToken,
          },
        })
          .then((res) =>
            res.json().then((data) => {
              const user_data: User = {
                ...data,
                roles:
                  decodedToken[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                  ],
              };
              setUser(user_data);
            })
          )
          .catch((err) => console.log(err));
      }
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element:
        token !== undefined ? (
          <RootLayout />
        ) : (
          <Navigate replace to="/auth/login" />
        ),
      children: [
        {
          path: "",
          element: <Navigate replace to="/courses" />,
        },
        {
          path: "account",
          element: <Account />,
        },
        {
          path: "users",
          element:
            user?.roles?.includes("Administrator") === true ? (
              <Users />
            ) : (
              <Navigate replace to="/" />
            ),
        },
        {
          path: "courses",
          element: <Courses />,
        },
        {
          path: "course/:courseId",
          element: <Course />,
        },
        {
          path: "course/:courseId/session/:sessionId",
          element: <SessionPage />,
        },
        {
          path: "course/create",
          element:
            user?.roles?.includes("Administrator") === true ? (
              <CreateCourse />
            ) : (
              <Navigate replace to="/" />
            ),
        },
        {
          path: "users/create",
          element:
            user?.roles?.includes("Administrator") === true ? (
              <CreateUser />
            ) : (
              <Navigate replace to="/" />
            ),
        },
        {
          path: "users/edit",
          element:
            user?.roles?.includes("Administrator") === true ? (
              <EditUser />
            ) : (
              <Navigate replace to="/" />
            ),
        },
      ],
    },
    {
      path: "/auth",
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
      ],
    },
  ]);

  return (
    <UserProvider
      value={{
        user,
        setUser: (val) => setUser(val),
        token,
        setToken: (val) => setToken(val),
      }}
    >
      <RouterProvider router={router} />
      <ToastContainer
        // stacked
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={5}
      />
    </UserProvider>
  );
}

export default App;
