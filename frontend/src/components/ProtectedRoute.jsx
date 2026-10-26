
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const API = "http://localhost:8080/api/auth/me";

export default function ProtectedRoute() {
  const [status, setStatus] = useState("checking");
  const location = useLocation();

  useEffect(() => {
    let active = true;

    fetch(API, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Not authenticated");
        }

        const data = await response.json();

        // Adjust this check if your /me endpoint uses a different response shape.
        if (data.user || data.id || data.email) {
          return "authenticated";
        }

        throw new Error("Not authenticated");
      })
      .then((result) => {
        if (active) setStatus(result);
      })
      .catch(() => {
        if (active) setStatus("unauthenticated");
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return <div className="auth-checking">Checking session...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
