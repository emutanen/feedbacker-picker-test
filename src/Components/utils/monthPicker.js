import moment from "moment";

export const getMonthId = (months, id) => months.findIndex(month => month === id) + 1;

export const isInRange = (year, monthId, range) => {
  if (range.from && range.to) {
    const currentDate = moment([year, monthId - 1, 1]).format("YYYY-MM-DD");
    const fromDate = moment([range.from.year, range.from.month - 1, 1]).format("YYYY-MM-DD");
    const toDate = moment([range.to.year, range.to.month - 1, 1]).format("YYYY-MM-DD");
    return moment(currentDate).isAfter(fromDate) && moment(currentDate).isBefore(toDate);
  }
  return false;
};

export const isLeftCorner = (year, monthId, range) => {
  if (!range.from || !range.to) {
    return false;
  }
  if (range.from.year === range.to.year && range.from.month === range.to.month) {
    return false;
  }
  const currentDate = moment([year, monthId - 1, 1]).format("YYYY-MM-DD");
  const fromDate = moment([range.from.year, range.from.month - 1, 1]).format("YYYY-MM-DD");

  return moment(currentDate).isSame(fromDate);
};

export const isRightCorner = (year, monthId, range) => {
  if (!range.from || !range.to) {
    return false;
  }
  if (range.from.year === range.to.year && range.from.month === range.to.month) {
    return false;
  }

  const currentDate = moment([year, monthId - 1, 1]).format("YYYY-MM-DD");

  if (range.to) {
    const toDate = moment([range.to.year, range.to.month - 1, 1]).format("YYYY-MM-DD");
    return moment(currentDate).isSame(toDate);
  }
  return false;
};

export const isLeftQuarter = (year, monthId, range) => {
  if (!range.from || !range.to) {
    return false;
  }
  return monthId % 3 === 1 && isInRange(year, monthId, range);
};

export const isRightQuarter = (year, monthId, range) => {
  if (!range.from || !range.to) {
    return false;
  }
  return monthId % 3 === 0 && isInRange(year, monthId, range);
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

export const isDisabled = (year, monthId, range) => {
  const currentDate = moment([year, monthId - 1, 1]).format("YYYY-MM-DD");
  if (range.from && range.from.year) {
    const fromDate = moment([range.from.year, range.from.month - 1, 1]).format("YYYY-MM-DD");
    return moment(currentDate).isBefore(fromDate) || moment(currentDate).isAfter(new Date());
  }
  return moment(currentDate).isAfter(new Date());
};
