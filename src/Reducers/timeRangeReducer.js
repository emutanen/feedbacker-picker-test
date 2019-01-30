import { fromJS } from "immutable";
import * as types from "../Actions/actionTypes";
import { generateInitialTimeScopeSelection } from "../Utils/timeIdRangeGenerator";

function setIndexValueTimeScope(state, timeRange) {
  return state.set("indexValueTimeRange", fromJS({ start: timeRange.from, end: timeRange.to }));
}

const initialState = fromJS(generateInitialTimeScopeSelection());

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_INDEX_VALUE_TIME_SCOPE:
      return setIndexValueTimeScope(state, action.timeRange);
    default:
      return state;
  }
}
