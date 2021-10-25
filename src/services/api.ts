import axios from "axios";

const api = axios.create({
  baseURL: "https://api-heat.herokuapp.com",
});

export { api };
