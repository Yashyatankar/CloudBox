import axios from "axios";

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000/accounts/",
    timeout: 5000,
    withCredentials: true
});

function normalizeError(error) {
    const data = error.response?.data || {};
    const normalized = new Error(data.error || "Something went wrong");
    normalized.details = data;
    normalized.status = error.response?.status;
    throw normalized;
}

export async function requestOtp(email) {
    try {
        const response = await instance.post("Request_otp/", { email });
        return response.data;
    } catch (error) {
        normalizeError(error);
    }
}

export async function verifyOtp(email, otp) {
    try {
        const response = await instance.post("/varify_otp", {
            email,
            otp
        });
        return response.data;
    } catch (error) {
        normalizeError(error);
    }
}