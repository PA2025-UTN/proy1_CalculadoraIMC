import { useCallback } from "react"
import axios from "axios"

export const useRefreshToken = () => {
  const refresh = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken")
      if (!refreshToken) return null

      const { data } = await axios.get(`${import.meta.env.VITE_BACK_URL}/auth/refresh-token`, {
        headers: {
          "refresh-token": refreshToken,
        },
      })

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken)
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken)
      }

      return data.accessToken
    } catch (err) {
      console.error("Error refrescando token", err)
      return null
    }
  }, [])

  return { refresh }
}

