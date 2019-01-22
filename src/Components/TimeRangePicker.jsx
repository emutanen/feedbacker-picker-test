import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withState, withHandlers, withProps } from "recompose";
import { Popover } from "@sievo/react-common-components";
import MonthPicker from "./MonthPicker";
import * as timeRangeActions from "../Actions/timeRangeActions";
import { toDisplayedTime } from "../Utils/timeIdConverter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import "../Styles/TimeRangePicker.css";

const PopoverStyled = styled(Popover)`
  position: relative;
`;

const PopoverContentParent = styled.div`
  position: absolute;
`;

const PopoverContent = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
`;

const PopoverRangeDisplay = styled.div`
  color: black;
  width: 100%;
  padding: 15px 7.5px 7.5px 7.5px;
  font-size: 16px;
  text-align: center;
`;

const FontAwesomeIconStyled = styled(FontAwesomeIcon)`
  position: relative;
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

const TimePicker = ({ from, to, onSetHandler, timeRangeInStore, yearTranslateStyle, onUpdateHandler }) => (
  <div>
    <MonthPicker
      defaultRange={timeRangeInStore}
      years={from && to ? generateRange(from, to) : {}}
      onChange={selectedRange => onSetHandler(selectedRange)}
      yearTranslateStyle={yearTranslateStyle}
      onRangeChange={range => onUpdateHandler(range)}
    />
  </div>
);

TimePicker.propTypes = {
  from: PropTypes.number,
  to: PropTypes.number,
  onSetHandler: PropTypes.func,
  onUpdateHandler: PropTypes.func,
  timeRangeInStore: PropTypes.instanceOf(Object),
};

const enhanceTimePicker = component =>
  compose(
    withState("rangeTranslation", "setRangeTranslation", 0),
    withProps(props => {
      return {
        maxIncrements: props.toYear - props.fromYear - 2, // In the design, 2 years are visible. That is why 2 increments less are needed to see the final year.
      };
    }),
    withHandlers({
      incrementTranslation: props => event => {
        event.preventDefault();
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
  )(component);

const PickerPopoverContent = props => {
  const displayFrom = props.displayRange.from
    ? toDisplayedTime(props.displayRange.from.year, props.displayRange.from.month)
    : " ";
  const displayTo = props.displayRange.to
    ? toDisplayedTime(props.displayRange.to.year, props.displayRange.to.month)
    : " ";

  return (
    <PopoverStyled placement="bottom" position="centered">
      <PopoverContentParent>
        <PopoverRangeDisplay>{`${displayFrom}-${displayTo}`}</PopoverRangeDisplay>
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
          onClick={props.incrementTranslation}
        >
          <FontAwesomeIconStyled icon={faCaretRight} />
        </RightArrow>
      </PopoverContentParent>
    </PopoverStyled>
  );
};

PickerPopoverContent.propTypes = {
  onSetHandler: PropTypes.func,
  onUpdateHandler: PropTypes.func,
  timeRangeInStore: PropTypes.instanceOf(Object),
};

const EnhancedPopoverContent = enhanceTimePicker(PickerPopoverContent);

const ScopePickerPrototype = ({ active, toggle, timeRangeInStore, onSetHandler, displayRange, onUpdateHandler }) => {
  const fromYear = 2004;
  const toYear = 2019;
  const from = timeRangeInStore.get("start").toJS();
  const to = timeRangeInStore.get("end").toJS();
  const displayFrom = from ? toDisplayedTime(from.year, from.month) : " ";
  const displayTo = to ? toDisplayedTime(to.year, to.month) : " ";
  const timeRangeEval = timeRangeInStore ? timeRangeInStore.toJS() : {};

  return (
    <span>
      <button className={`btn btn-outline sievo-popover-parent ${active ? "active" : ""}`} onClick={toggle}>
        <i className="fa fa-calendar sievo-popover-control-icon" aria-hidden="true" />
        {`${displayFrom} - ${displayTo}`}
      </button>
      {active ? (
        <EnhancedPopoverContent
          onSetHandler={range => {
            onSetHandler(range);
            toggle();
          }}
          onUpdateHandler={range => {
            onUpdateHandler(range);
          }}
          timeRangeInStore={timeRangeEval}
          displayRange={displayRange ? displayRange : timeRangeEval}
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
  displayRange: PropTypes.instanceOf(Object),
  onUpdateHandler: PropTypes.func,
};

const ScopePicker = compose(
  withState("active", "setActive", false),
  withState("displayRange", "setDisplayRange", undefined),
  withHandlers({
    toggle: ({ setActive }) => () => setActive(active => !active),
    onUpdateHandler: props => rangeObj => {
      console.log("Uusi range: ", rangeObj);
      props.setDisplayRange(rangeObj.range);
    },
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
