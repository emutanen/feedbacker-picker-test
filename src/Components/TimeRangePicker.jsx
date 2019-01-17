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

const PopoverStyled = styled(Popover)`
  position: relative;
`;

const PopoverContent = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
`;

const PopoverRangeDisplay = styled.div`
  border: 2px solid #3bee2b;
  color: black;
  flex-grow: 0;
  flex-shrink: 0;
  width: 100%;
  padding: 15px 7.5px 7.5px 7.5px;
  font-size: 16px;
  text-align: center;
`;

const LeftArrow = styled.div`
  float: left;
  display: inline-block;
  width: 48px;
  color: black;
  border: 4px solid #123456;
`;

const RightArrow = styled.div`
  float: right;
  display: inline-block;
  width: 48px;
  color: black;
  border: 4px solid #123456;
`;

// prettier-ignore
const generateRange = (from, to) =>
  Array((to - from) + 1)
    .fill(from)
    .map((n, i) => (n + i).toString());

const TimePicker = ({ from, to, onSetHandler, timeRangeInStore, yearTranslateStyle }) => (
  <div>
    <MonthPicker
      defaultRange={timeRangeInStore}
      years={from && to ? generateRange(from, to) : {}}
      onChange={selectedRange => onSetHandler(selectedRange)}
      yearTranslateStyle={yearTranslateStyle}
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
    withState("rangeTranslation", "setRangeTranslation", 0),
    withHandlers({
      incrementTranslation: props => event => {
        event.preventDefault();
        props.setRangeTranslation(props.rangeTranslation + 1);
      },
      decrementTranslation: props => event => {
        event.preventDefault();
        props.setRangeTranslation(props.rangeTranslation - 1);
      },
    }),
    withState("startSelection", "setStartSelection", undefined),
    withState("endHover", "setEndHover", undefined),
    withState("endSelection", "setEndSelection", undefined),
  )(component);

const PickerPopoverContent = props => (
  <PopoverStyled placement="bottom" position="centered">
    <LeftArrow
      id="timerange-left-arrow"
      type="input"
      onClick={e => {
        props.decrementTranslation(e);
        console.log("Clicked left arrow!");
      }}
    >
      Click Me
    </LeftArrow>
    <RightArrow
      id="timerange-right-arrow"
      type="input"
      onClick={e => {
        props.incrementTranslation(e);
        console.log("Clicked right arrow!");
      }}
    >
      Click meh!
    </RightArrow>
    <PopoverRangeDisplay>
      {(props.timeRangeInStore.start && props.timeRangeInStore.start.year) || ""} -{" "}
      {props.timeRangeInStore.end.year || ""}
    </PopoverRangeDisplay>
    <PopoverContent>
      <TimePicker from={2010} to={2015} yearTranslateStyle={props.rangeTranslation} {...props} />
    </PopoverContent>
  </PopoverStyled>
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
