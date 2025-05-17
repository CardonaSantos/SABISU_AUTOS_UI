import dayjs from "dayjs";
import "dayjs/locale/es";
// import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);
dayjs.locale("es");

export const formateDateWithMinutes = (date: string): string => {
  const dateFormatted = dayjs(date).format("DD/MM/YYYY hh:mm A");

  return dateFormatted;
};

export const formateDate = (date: string): string => {
  const dateFormatted = dayjs(date).format("DD/MM/YYYY");
  return dateFormatted;
};
