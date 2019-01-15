import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withState, withHandlers } from "recompose";
import { Popover } from "@sievo/react-common-components";
import MonthPicker from "./MonthPicker";
// import { Popover } from "react-bootstrap";
// import YearPicker from "./YearPicker";
import * as timeRangeActions from "../Actions/timeRangeActions";
import { timeRangeSelector } from "../Selectors/timeRangeSelectors";
import { toDisplayedTime } from "../Utils/timeIdConverter";
import "../Styles/TimeRangePicker.css";
import styled from "styled-components";

const PopoverHeader = styled.div`
  color: black;
  border: 2px solid #123546;
  flex-grow: 0;
  flex-shrink: 0;
  width: 100%;
  padding: 7.5px 7.5px 15px 7.5px;
  font-size: 16px;
  text-align: center;
`;

const PopoverContent = styled.div`
  border: 2px solid #ee2bee;
  flex-grow: 1;
  flex-shrink: 1;
`;

const PopoverFooter = styled.div`
  border: 2px solid #3bee2b;
  flex-grow: 0;
  flex-shrink: 0;
  width: 100%;
  padding: 15px 7.5px 7.5px 7.5px;
  font-size: 16px;
  text-align: center;
`;

// prettier-ignore
const generateRange = (from, to) =>
  Array((to - from) + 1)
    .fill(from)
    .map((n, i) => (n + i).toString());

const TimePicker = ({ from, to, onSetHandler, timeRangeInStore }) => (
  <div>
    <MonthPicker
      defaultRange={timeRangeInStore}
      years={from && to ? generateRange(from, to) : {}}
      onChange={selectedRange => onSetHandler(selectedRange)}
    />
  </div>
);

TimePicker.propTypes = {
  from: PropTypes.number,
  to: PropTypes.number,
  onSetHandler: PropTypes.func,
  timeRangeInStore: PropTypes.instanceOf(Object),
};

const enhanceTimePicker = component =>
  compose(
    withState("startSelection", "setStartSelection", undefined),
    withState("endHover", "setEndHover", undefined),
    withState("endSelection", "setEndSelection", undefined),
  )(component);

const PickerPopoverContent = props => (
  <Popover placement="bottom" position="centered">
    <PopoverHeader>Select a time scope</PopoverHeader>
    <PopoverContent>
      <TimePicker from={2010} to={2015} {...props} />
    </PopoverContent>
    <PopoverFooter>
      {(props.timeRangeInStore.start && props.timeRangeInStore.start.year) || ""} -{" "}
      {props.timeRangeInStore.end.year || ""}
    </PopoverFooter>
  </Popover>
);

PickerPopoverContent.propTypes = {
  onSetHandler: PropTypes.func,
  timeRangeInStore: PropTypes.instanceOf(Object),
  setStartSelection: PropTypes.func,
  setEndHover: PropTypes.func,
  setEndSelection: PropTypes.func,
};

const EnhancedPopoverContent = enhanceTimePicker(PickerPopoverContent);

const ScopePickerPrototype = ({ active, toggle, timeRangeInStore, onSetHandler }) => {
  const start = timeRangeInStore.get("start").toJS();
  const end = timeRangeInStore.get("end").toJS();
  const displayStart = start ? toDisplayedTime(start.year, start.month) : " ";
  const displayEnd = end ? toDisplayedTime(end.year, end.month) : " ";

  return (
    <span>
      <button className={`btn btn-outline sievo-popover-parent ${active ? "active" : ""}`} onClick={toggle}>
        <i className="fa fa-calendar sievo-popover-control-icon" aria-hidden="true" />
        {`${displayStart} - ${displayEnd}`}
      </button>
      {active ? (
        <EnhancedPopoverContent
          onSetHandler={range => {
            onSetHandler(range);
            toggle();
          }}
          timeRangeInStore={timeRangeInStore ? timeRangeInStore.toJS() : {}}
        />
      ) : null}
    </span>
  );
};

ScopePickerPrototype.propTypes = {
  active: PropTypes.bool,
  toggle: PropTypes.func,
  timeRangeInStore: PropTypes.instanceOf(Object),
  onSetHandler: PropTypes.func,
};

const ScopePicker = compose(
  withState("active", "setActive", false),
  withHandlers({
    toggle: ({ setActive }) => () => setActive(active => !active),
  }),
  connect(
    state => ({
      timeRangeInStore: state.timeRange.get("indexValueTimeRange"),
    }),
    dispatch => ({
      onSetHandler: range => dispatch(timeRangeActions.setIndexValueTimeScope(range)),
    }),
  ),
)(ScopePickerPrototype);

export default ScopePicker;
