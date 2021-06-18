import axios from "axios";
import { getFromStorage } from "./utils/storage";

const obj = getFromStorage("the_main_app");

const { token } = obj;

const instance = axios.create({
  baseURL: "http://localhost:7000",
  headers: {
    Authorization: token ? token : "",
  },
});

export default instance;
