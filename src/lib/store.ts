import { setContext } from "svelte";
import { writable } from "svelte/store";

export async function store() {
    let token = writable(window.localStorage.getItem("token"));

    const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      const response = await fetch("http://localhost:8000/api/users/me", requestOptions)

      if (!response.ok) {
        
      }
      const data = await response.json()
      localStorage.setItem("token", data.access_token)
    setContext('token', token);
    return window.localStorage.getItem("token")
}