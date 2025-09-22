import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://cartitas-back.onrender.com"

const public_api = axios.create({
  baseURL: BASE_URL,
})

const secured_api = axios.create({
  baseURL: BASE_URL,
})

secured_api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { public_api, secured_api }