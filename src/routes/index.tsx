import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, MainLayout } from "@/layouts";
import { Login, NotFound, Register, Workouts } from "@/pages";
import { ProtectedRoute, PublicRoute } from "./components";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/workouts" replace />,
      },
      {
        path: 'workouts',
        element: (
          <ProtectedRoute>
            <Workouts />
          </ProtectedRoute>
        )
      },
    ],
  },
  {
    path: '/auth',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
