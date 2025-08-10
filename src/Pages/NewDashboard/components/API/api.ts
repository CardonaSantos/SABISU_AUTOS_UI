import axios from "axios";
import { TimeLineDto } from "./interfaces.interfaces";

const API_URL = import.meta.env.VITE_API_URL;

export const createNewTimeLine = async (dto: TimeLineDto) => {
  return await axios.post(`${API_URL}/warranty/create-new-timeline`, dto);
};
