import axios from "axios";

const API = axios.create({ baseURL: "https://collab-doc-springboot-production.up.railway.app/" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("Profile")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("Profile")).token
    }`;
  }
  return req;
});

export const logIn = (authData) => API.post("api/auth/login", authData);
export const signUp = (authData) => API.post("api/auth/signup", authData);

export const getAllUsers = () => API.get("api/users");

// export const createTeam = (team) => API.post("api/teams", team);

export const createTeam = (team) => API.post("api/teams", team, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getAllTeams = () => API.get("api/teams");

export const getTeamById = (id) => API.get(`api/teams/${id}`);
