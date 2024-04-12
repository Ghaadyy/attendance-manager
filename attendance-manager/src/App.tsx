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
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Users from "./pages/Users";
import CreateCourse from "./pages/CreateCourse";
import CreateUser from "./pages/CreateUser";
import { Provider as UserProvider } from "./store/UserContext";
import { useEffect, useState } from "react";
import { User } from "./models/User";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

function App() {
  const storedToken = localStorage.getItem("token");

  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string | undefined>(
    storedToken ?? undefined
  );

  useEffect(() => {
    if (storedToken) {
      fetch("http://localhost:8000/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + storedToken,
        },
      }).then((res) =>
        res.json().then((data) => {
          setUser(data);
        })
      );
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
          element: <Dashboard />,
        },
        {
          path: "account",
          element: <Account />,
        },
        {
          path: "users",
          element: <Users />,
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
          path: "course/create",
          element: <CreateCourse />,
        },
        {
          path: "users/create",
          element: <CreateUser />,
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
    </UserProvider>
  );
}

export default App;
