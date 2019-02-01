import moment from "moment";

export const getMonthNumber = (months, id) => months.findIndex(month => month === id) + 1; // if id not found, returns 0

export const isInRange = (year, key, range) => {
  if (range.from && range.to) {
    const currentDate = moment([year, key, 1]).format("YYYY-MM-DD");
    const fromDate = moment([range.from.year, range.from.month - 1, 1]).format("YYYY-MM-DD");
    const toDate = moment([range.to.year, range.to.month - 1, 1]).format("YYYY-MM-DD");
    return moment(currentDate).isAfter(fromDate) && moment(currentDate).isBefore(toDate);
  }
  return false;
};

export const isLeftCorner = (year, key, range) => {
  if (!range.from || !range.to) {
    return false;
  }
  if (range.from.year === range.to.year && range.from.month === range.to.month) {
    return false;
  }
  const currentDate = moment([year, key, 1]).format("YYYY-MM-DD");
  const fromDate = moment([range.from.year, range.from.month - 1, 1]).format("YYYY-MM-DD");

  return moment(currentDate).isSame(fromDate);
};

export const isRightCorner = (year, key, range) => {
  if (!range.from || !range.to) {
    return false;
  }
  if (range.from.year === range.to.year && range.from.month === range.to.month) {
    return false;
  }

  const currentDate = moment([year, key, 1]).format("YYYY-MM-DD");

  if (range.to) {
    const toDate = moment([range.to.year, range.to.month - 1, 1]).format("YYYY-MM-DD");
    return moment(currentDate).isSame(toDate);
  }
  return false;
};

export const isLeftQuarterAndEnd = (year, key, range) => {
  const monthNumber = key + 1;
  if (!range.from || !range.to) {
    return false;
  }
  return monthNumber % 3 === 1 && monthNumber === parseInt(range.to.month);
};

export const isLeftQuarter = (year, key, range) => {
  const monthNumber = key + 1;
  if (!range.from || !range.to) {
    return false;
  }
  return monthNumber % 3 === 1 && isInRange(year, key, range);
};

export const isRightQuarterAndStart = (year, key, range) => {
  const monthNumber = key + 1;
  if (!range.from || !range.to) {
    return false;
  }
  return monthNumber % 3 === 0 && monthNumber === parseInt(range.from.month);
};

export const isRightQuarter = (year, key, range) => {
  const monthNumber = key + 1;
  if (!range.from || !range.to) {
    return false;
  }
  return monthNumber % 3 === 0 && isInRange(year, key, range);
};

export const isFullYear = rangeInState => {
  if (!rangeInState) return;

  const hasSameYear = rangeInState.from && rangeInState.to && rangeInState.from.year === rangeInState.to.year;
  if (hasSameYear && rangeInState.from.month === "1" && rangeInState.to.month === "12") {
    return true;
  }
  if (
    hasSameYear &&
    rangeInState.from.year === moment().year() &&
    rangeInState.from.month === "1" &&
    rangeInState.to.month === moment().month() + 1
  ) {
    return true;
  }
  return false;
};

export const isDisabled = (year, key, range) => {
  const currentDate = moment([year, key, 1]).format("YYYY-MM-DD");
  if (range.from && range.from.year) {
    const fromDate = moment([range.from.year, range.from.month - 1, 1]).format("YYYY-MM-DD");
    return moment(currentDate).isBefore(fromDate) || moment(currentDate).isAfter(new Date());
  }
  return moment(currentDate).isAfter(new Date());
};
