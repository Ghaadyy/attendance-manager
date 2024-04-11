import { useEffect } from "react";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
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

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

// const location = useLocation();

// useEffect(() => {
//   window.HSStaticMethods.autoInit();
// }, [location.pathname]);

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
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
          path: "course",
          element: <Course />,
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

  return <RouterProvider router={router} />;
}

export default App;
