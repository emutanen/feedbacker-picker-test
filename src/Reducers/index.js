import { combineReducers } from "redux";
import timeRangeReducer from "./timeRangeReducer";

const appReducer = combineReducers({
  timeRange: timeRangeReducer,
});

export default appReducer;
