import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withState, withHandlers, withProps } from "recompose";
import { Popover } from "@sievo/react-common-components";
import MonthPicker from "./MonthPicker";
// import { Popover } from "react-bootstrap";
// import YearPicker from "./YearPicker";
import * as timeRangeActions from "../Actions/timeRangeActions";
import { timeRangeSelector } from "../Selectors/timeRangeSelectors";
import { toDisplayedTime } from "../Utils/timeIdConverter";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";

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

const FontAwesomeIconStyled = styled(FontAwesomeIcon)`
  position: relative;
  box-sizing: border-box;
`;

const LeftArrow = styled.div`
  position: absolute;
  overflow: hidden;
  height: 26px;
  line-height: 1;
  left: 6px;
  transform: translateY(8px);
  font-size: 28px;

  color: black;
  cursor: pointer;
`;

const RightArrow = styled.div`
  position: absolute;
  overflow: hidden;
  height: 26px;
  line-height: 1;
  right: 6px;
  transform: translateY(8px);
  font-size: 28px;

  color: black;
  cursor: pointer;
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
    withProps(props => {
      return {
        maxIncrements: props.toYear - props.fromYear - 2, // 2 years visible means 2 increments less to see the final year
      };
    }),
    withHandlers({
      incrementTranslation: props => event => {
        event.preventDefault();
        console.log("world!");
        if (props.rangeTranslation <= props.maxIncrements) {
          props.setRangeTranslation(props.rangeTranslation + 1);
        }
      },
      decrementTranslation: props => event => {
        event.preventDefault();
        if (props.rangeTranslation > 0) {
          props.setRangeTranslation(props.rangeTranslation - 1);
        }
      },
    }),
    withState("startSelection", "setStartSelection", undefined),
    withState("endHover", "setEndHover", undefined),
    withState("endSelection", "setEndSelection", undefined),
  )(component);

const PickerPopoverContent = props => (
  <PopoverStyled placement="bottom" position="centered">
    <PopoverRangeDisplay>
      {(props.timeRangeInStore.start && props.timeRangeInStore.start.year) || ""} -{" "}
      {props.timeRangeInStore.end.year || ""}
    </PopoverRangeDisplay>
    <PopoverContent>
      <TimePicker from={props.fromYear} to={props.toYear} yearTranslateStyle={props.rangeTranslation} {...props} />
    </PopoverContent>
    <LeftArrow
      id="timerange-left-arrow"
      className="left-arrow-button"
      type="input"
      onClick={props.decrementTranslation}
    >
      <FontAwesomeIconStyled icon={faCaretLeft} />
    </LeftArrow>
    <RightArrow
      id="timerange-right-arrow"
      className="right-arrow-button"
      type="input"
      onClick={e => {
        props.incrementTranslation(e);
        console.log("Hello");
      }}
    >
      <FontAwesomeIconStyled icon={faCaretRight} />
    </RightArrow>
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

  const fromYear = 1900;
  const toYear = 1910;

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
          fromYear={fromYear}
          toYear={toYear}
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
