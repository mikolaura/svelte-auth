<script lang="ts">
  import { get, writable } from "svelte/store";

  import { onMount, setContext } from "svelte";
  /**
   * @type {string | null}
   */
  let token: string | null;
  let email = "";
  let password = "";
  /**
   * @type {() => Promise<void>}
   */
  let createUser: () => Promise<void>;
  /**
   * @type {() => Promise<void>}
   */
  let handleLogin: () => Promise<void>;

  let posts: {} = {};
  if (typeof localStorage !== "undefined") {
    const get = async () => {
      token = localStorage.getItem("token");
      console.log(token);
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      const response = await fetch(
        "http://localhost:8000/api/users/me",
        requestOptions,
      );

      if (!response.ok) {
      }
      const data = await response.json();
      console.log(data);
      email = data.email;
      setContext("token", token);
    };
    createUser = async () => {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, hashed_password: password }),
      };
      const responses = await fetch(
        "http://localhost:8000/users",
        requestOptions,
      );
      const data = await responses.json();
      if (!responses.ok) {
        console.log(data.detail);
      } else {
        localStorage.setItem("token", data.access_token);
        token = data.access_token;
      }
    };
    handleLogin = async () => {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(
          `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`,
        ),
      };
      const response = await fetch(
        "http://localhost:8000/api/token",
        requestOptions,
      );
      const data = await response.json();
      if (!response.ok) {
        console.log(data.detail);
      } else {
        token = data.access_token;
        localStorage.setItem("token", data.access_token);
      }
    };
    const getPosts = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      const response = await fetch(
        "http://localhost:8000/api/post",
        requestOptions,
      );

      if (!response.ok) {
      }
      const data = await response.json();
      posts = data;
      console.log(Object.entries(posts));
    };
    get();
    onMount(getPosts);
  }
  const users = [
    { firstName: "John", lastName: "Doe" },
    { firstName: "Jane", lastName: "Roe" },
  ];
</script>

<div>
  {#if !token || token == "undefined" || token == "null"}
    <div>
      <input bind:value={email} />
      <input bind:value={password} />
      <button on:click={createUser}>Create user</button>
    </div>
    <div>
      <input bind:value={email} />
      <input bind:value={password} />
      <button on:click={handleLogin}>LogIn user</button>
    </div>
  {:else if token}
    <div>
      {#each Object.entries(posts) as post}
      {post[1]["anons"]}
      {/each}
    </div>
  {/if}
</div>
