// ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking"); // checking | ok | fail

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/accounts/me/", { withCredentials: true })
      .then(() => setStatus("ok"))
      .catch(() => setStatus("fail"));
  }, []);

  if (status === "checking") return <p>Loading...</p>;
  if (status === "fail") return <Navigate to="/" replace />;
  return children;
}

export default ProtectedRoute;