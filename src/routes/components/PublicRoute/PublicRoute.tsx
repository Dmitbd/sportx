import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "react-router-dom";

// PublicRoute для публичных маршрутов (только для неавторизованных)
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuth } = useAuthStore();
  return isAuth ? <Navigate to="/workouts" replace /> : children;
};
