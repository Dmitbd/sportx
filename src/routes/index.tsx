import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, MainLayout } from "@/layouts";
import { Create, Login, NotFound, Register, Workouts } from "@/pages";
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
            path: 'create',
            element: (
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            )
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
      // Обработка несуществующих путей внутри MainLayout
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);
