import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, MainLayout } from "@/layouts";
import { Confirm, Guided, Login, NotFound, Register, Workouts } from "@/pages";
import { WorkoutDetails } from "@/pages/Workouts/WorkoutDetails/WorkoutDetails";
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
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <Workouts />
              </ProtectedRoute>
            )
          },
          {
            path: ':id',
            element: (
              <ProtectedRoute>
                <WorkoutDetails />
              </ProtectedRoute>
            ),
          },
          {
            path: 'create',
            children: [
              {
                index: true,
                element: <Navigate to="guided" replace />
              },
              {
                path: 'guided',
                element: (
                  <ProtectedRoute>
                    <Guided />
                  </ProtectedRoute>
                )
              },
              {
                path: 'confirm',
                element: (
                  <ProtectedRoute>
                    <Confirm />
                  </ProtectedRoute>
                )
              }
            ]
          }
        ]
      },
      {
        path: 'auth',
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
        element: <NotFound />
      }
    ]
  }
]);
