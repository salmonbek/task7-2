import axios from "axios";

const request = axios.create({
  baseURL: "https://640b68ce81d8a32198e3826b.mockapi.io/api/v1/",
  timeout: 10000,
});

export default request;
