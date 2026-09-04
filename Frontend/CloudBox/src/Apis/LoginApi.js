import axios from 'axios';

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 5000,
  withCredentials: true,   // sends/stores the session cookie
});

function normalizeError(error) {
  const data = error.response?.data || {};
  const normalized = new Error(data.error || "Something went wrong");
  normalized.details = data;
  normalized.status = error.response?.status;
  throw normalized;
}

export async function registerUser(payload) {
  try {
    const response = await instance.post('/accounts/register/', payload);
    return response.data;
  } catch (error) {
    normalizeError(error);
  }
}

export async function loginUser(payload) {
  try {
    const response = await instance.post('/accounts/login/', payload);
    return response.data;
  } catch (error) {
    console.log("FULL ERROR:", error.response?.data);
    normalizeError(error);
  }
}