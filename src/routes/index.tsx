import { createBrowserRouter, Navigate } from "react-router-dom";
import { Confirm, Guided, Login, NotFound, Register, WorkoutsList, WorkoutDetails } from "@/pages";
import { ProtectedRoute, PublicRoute } from "./components";

export const router = createBrowserRouter([
  {
    path: '/',
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
                <WorkoutsList />
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
        children: [
          {
            path: 'login',
            element: (
              <PublicRoute>
                <Login />
              </PublicRoute>
            )
          },
          {
            path: 'register',
            element: (
              <PublicRoute>
                <Register />
              </PublicRoute>
            ),
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
