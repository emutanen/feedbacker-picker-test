import * as types from "./actionTypes.js";

export function setIndexValueTimeScope(timeRange) {
  return {
    type: types.SET_INDEX_VALUE_TIME_SCOPE,
    timeRange,
  };
}
