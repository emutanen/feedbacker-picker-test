import { createSelector } from "reselect";
import { toDisplayedTime } from "../Utils/timeIdConverter";
import { generateTimeIdRange } from "../Utils/timeIdRangeGenerator";

export const loadMarketIndexValuesInProgressSelector = state =>
  state.indexValues.get("loadMarketIndexValuesInProgress");

export const marketIndexValueByTimeIdSelector = (state, timeId) => {
  const marketIndex = state.indexValues.getIn(["marketIndexValues", timeId]);
  return marketIndex ? marketIndex.toJS() : undefined;
};

export const updateIndexValueValidationResultsSelector = createSelector(
  state => state.indexValues.get("updateIndexValueValidationResults"),
  results => (results === undefined ? [] : results.toJS()),
);

export const updateIndexValueValidationResultByTimeIdSelector = (state, timeId) =>
  state.indexValues.getIn(["updateIndexValueValidationResults", timeId]).toJS();

// export const timeScopeSelector = state => state.indexValues.get('indexValueTimeRange');

const emptyObject = {};
const emptyArray = [];

const timeScopeStartSelector = state => state.indexValues.getIn(["indexValueTimeRange", "start"]);
const timeScopeEndSelector = state => state.indexValues.getIn(["indexValueTimeRange", "end"]);

export const indexValueTimeRangeSelector = createSelector(
  timeScopeStartSelector,
  timeScopeEndSelector,
  (start, end) => (start && end ? generateTimeIdRange(start.toJS(), end.toJS()) : emptyArray),
);

export const indexValuesSelector = createSelector(
  state => state.indexValues.get("marketIndexValues"),
  indexValues => (indexValues ? indexValues.toJS() : emptyObject),
);

const mapIndexValue = iv => ({
  id: iv.id,
  timeId: iv.timeId,
  indexValue: iv.value.toLocaleString(),
  displayTime: toDisplayedTime(iv.timeId),
});

export const visibleIndexValuesSelector = createSelector(
  indexValueTimeRangeSelector,
  indexValuesSelector,
  (timeRange, indexValues) =>
    timeRange.map(timeId =>
      indexValues[timeId]
        ? mapIndexValue(indexValues[timeId])
        : {
            timeId,
            indexValue: 0,
            displayTime: toDisplayedTime(timeId),
          },
    ),
);
