import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const API_URL = "/api/auth";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function checkSession() {
      try {
        const response = await fetch(`${API_URL}/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          setAuthenticated(false);
          return;
        }

        const data = await response.json();
        setAuthenticated(Boolean(data.user?.id));
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Session check failed:", error);
          setAuthenticated(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    checkSession();

    return () => controller.abort();
  }, []);

  if (loading) {
    return <p>Checking session...</p>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}