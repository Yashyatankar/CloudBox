import axios from 'axios';


const instance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 5000,
  headers: { "X-Custom-Header": "foobar" },
});
async function UserIfno(payload) {

  try {

    const response = await instance.post('/accounts/register', payload)
    return response.data

  }

  catch (error) {

    const data = error.response?.data || {};
    const normalized = new Error(data.error || "Something went wrong");
    normalized.details = data; // field-level errors, used by AuthPage to show them per-field
    normalized.status = error.response?.status;
    throw normalize
    

  }

}
