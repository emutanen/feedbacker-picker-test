import { format } from "date-fns";
const timeIdDisplayedFormat = "yyyy/MM";

// const toTimeId = (year, month) => `${year}${`0${month}`.slice(-2)}0`;

// eslint-disable-next-line
export function toDisplayedTime(year, month) {
  // const timeId = toTimeId(year, month);
  const parsedDate = format(new Date(year, month - 1), timeIdDisplayedFormat);
  // const parsedDate = window.moment(timeId.toString().slice(0, 6), "YYYYMM");
  //console.log("Parsed date was: ", parsedDate);
  return parsedDate || undefined;
}
