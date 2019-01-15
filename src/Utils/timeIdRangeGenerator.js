const toTimeId = (year, month) => `${year}${`0${month}`.slice(-2)}0`;

export const generateTimeIdRange = (from, to) => {
  const timeIds = [];
  let start = from;
  let end = to;

  if (!(from.year && to.year && from.month && to.month)) return [];

  if (from.year > to.year || (from.year === to.year && from.month > to.month)) {
    start = to;
    end = from;
  }

  // prettier-ignore
  for (let year = start.year; year <= end.year; year++) {
    for (
      let month = start.year === year ? start.month : 1;
      month <= (end.year === year ? end.month : 12);
      month++
    ) {
      timeIds.push(Number(toTimeId(year, month)));
    }
  }

  return timeIds;
};

export const generateInitialTimeScopeSelection = () => {
  const currentYear = new Date().getFullYear();

  return {
    indexValueTimeRange: {
      start: {
        timeId: toTimeId(currentYear, 1),
        year: currentYear,
        month: 1,
      },
      end: {
        timeId: toTimeId(currentYear, 12),
        year: currentYear,
        month: 12,
      },
    },
  };
};
