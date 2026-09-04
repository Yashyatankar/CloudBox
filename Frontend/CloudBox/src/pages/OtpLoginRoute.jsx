// src/pages/OtpLoginRoute.jsx
import { useNavigate } from "react-router-dom";
import OtpPage from "./Components/OtpPage";   // note: "../" since it's one level up now

function OtpLoginRoute() {
    const navigate = useNavigate();
    return (
        <OtpPage
            onSuccess={() => navigate("/dashboard")}
            onBack={() => navigate("/")}
        />
    );
}

export default OtpLoginRoute;