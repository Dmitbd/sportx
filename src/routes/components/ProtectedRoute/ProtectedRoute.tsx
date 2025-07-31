import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "react-router-dom";

// ProtectedRoute для приватных маршрутов
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuth } = useAuthStore();
  return isAuth ? children : <Navigate to="/auth/login" replace />;
};
