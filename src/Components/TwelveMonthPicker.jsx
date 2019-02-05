import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import classNames from "classnames";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getMonthNumber, isFullYear, shouldUpdateYearInRange, isEmptyObject } from "./utils/monthPicker";
import {
  isInRange,
  isLeftCorner,
  isRightCorner,
  isDisabled,
  isLeftQuarter,
  isLeftQuarterAndEnd,
  isRightQuarter,
  isRightQuarterAndStart,
} from "./utils/monthPicker";

const Month = styled.button`
  display: block;
  box-sizing: border-box;
  font-size: 13px;
  font-family: Qlikview Sans;
  font-weight: normal;
  cursor: pointer;

  width: 36px;
  height: 36px;
  border: none;
  padding: 0;

  color: #164d85;
  background-color: white;

  &.hover-active:hover:not(.btn-corner):not(:disabled) {
    background-color: #092642;
    border-radius: 100%;
    color: white;
    z-index: 5;
  }
  &.btn-range {
    background: #164d85;
    color: white;
    z-index: 4;
  }
  &.btn-quarter-left {
    background: #164d85;
    border-radius: 100%;
    color: white;
    z-index: 4;
  }
  &.btn-quarter-right {
    background: #164d85;
    border-radius: 100%;
    color: white;
    z-index: 4;
  }
  &.btn-range-endpoint-left {
    background: #092642;
    border-radius: 100%;
    color: white;
    z-index: 5;
  }
  &.btn-range-endpoint-right {
    background: #092642;
    border-radius: 100%;
    color: white;
    z-index: 5;
  }
  &:disabled {
    color: #9aa2ae;
    background: #f5f7f7;
    cursor: auto;
  }
`;

const LeftQuarterMonthButtonSetup = (key, isTouched, year, range, selectedRange, month, that) => (
  <div
    style={{
      display: "block",
      boxSizing: "border-box",
      background: "linear-gradient(to left, #164d85 50%, white 50%)",
      height: "100%",
      width: "100%",
      backgroundColor: "#164d85",
    }}
  >
    {MonthSetup(key, isTouched, year, range, selectedRange, month, that)}
  </div>
);

const LeftRangeEndMonthButtonSetup = (key, isTouched, year, range, selectedRange, month, that) => (
  <div
    style={{
      display: "block",
      boxSizing: "border-box",
      background: "linear-gradient(to left, #164d85 50%, white 50%)",
      height: "100%",
      width: "100%",
      backgroundColor: "#164d85",
    }}
  >
    {MonthSetup(key, isTouched, year, range, selectedRange, month, that)}
  </div>
);

const RightQuarterMonthButtonSetup = (key, isTouched, year, range, selectedRange, month, that) => (
  <div
    style={{
      display: "block",
      boxSizing: "border-box",
      background: "linear-gradient(to right, #164d85 50%, white 50%)",
      height: "100%",
      width: "100%",
      backgroundColor: "#164d85",
    }}
  >
    {MonthSetup(key, isTouched, year, range, selectedRange, month, that)}
  </div>
);

const RightRangeEndMonthButtonSetup = (key, isTouched, year, range, selectedRange, month, that) => (
  <div
    style={{
      display: "block",
      boxSizing: "border-box",
      background: "linear-gradient(to right, #164d85 50%, white 50%)",
      height: "100%",
      width: "100%",
      backgroundColor: "#164d85",
    }}
  >
    {MonthSetup(key, isTouched, year, range, selectedRange, month, that)}
  </div>
);

const MonthSetup = (key, isTouched, year, range, selectedRange, month, that) => {
  return (
    <Month
      key={`${key}${year}`}
      className={classNames({
        "btn-month": true,
        "hover-active": !isTouched,
        "btn-range": isInRange(year, key, range),
        "btn-range-endpoint-left": isLeftCorner(year, key, range),
        "btn-range-endpoint-right": isRightCorner(year, key, range),
        "btn-selected": isInRange(year, key, selectedRange),
        "btn-quarter-left": isLeftQuarter(year, key, range),
        "btn-quarter-right": isRightQuarter(year, key, range),
      })}
      value={month}
      id={`${month}-${year}`}
      disabled={!!isDisabled(year, key, range)}
      onMouseDown={e => that.onMouseDownMonth(e, year)}
      onMouseMove={e => that.onMouseMoveMonth(e, year)}
      onMouseUp={e => that.onMouseUpMonth(e, year)}
      onTouchStart={e => that.onTouchStartMonth(e, year)}
      onTouchMove={that.onTouchMoveMonth}
      onTouchEnd={that.onTouchEndMonth}
    >
      {month}
    </Month>
  );
};

export default class TwelveMonthPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * @idea Update this component only when there is a change in the year it corresponds to
   * @param {*} nextProps
   */
  shouldComponentUpdate(nextProps) {
    // if range start is empty and nextProps range start is not empty then update everything
    if (isEmptyObject(this.props.range.from) && nextProps.range.from) {
      return true;
    }
    // range start never changes during range picking unless range becomes empty first
    // there is no need to re-render years before the range start
    // Rebuild virtual DOM if: if range end not empty AND range end changes AND year within range
    if (
      !isEmptyObject(this.props.range.to) &&
      this.props.range.to !== nextProps.range.to &&
      shouldUpdateYearInRange(this.props.year, nextProps.range) // don't use if range.to is null
    ) {
      return true;
    }
    return false;
  }

  // Mouse events
  onMouseDownMonth = (e, year) => {
    const { isTouched, range } = this.props;
    if (isTouched === true) return;

    const monthNumber = getMonthNumber(this.props.months, e.target.value);
    if (!range.from) {
      this.props.setNewState({
        range: { from: { year, month: monthNumber.toString() } },
        selectedRange: {},
        selectedYear: "",
      });
      return;
    }
    const newRange = {
      from: range.from,
      to: { year, month: monthNumber.toString() },
    };
    this.props.setNewState({ range: {}, selectedRange: newRange });
  };

  onMouseMoveMonth = (e, year) => {
    const { isTouched, range } = this.props;
    if (!range.from || !!isTouched) return;

    const monthNumber = getMonthNumber(this.props.months, e.target.value);
    this.props.setNewState({
      range: { from: range.from, to: { year, month: monthNumber.toString() } },
    });
  };

  onMouseUpMonth = (e, year) => {
    const { isTouched, range } = this.props;
    if (!range.from || !!isTouched) return;

    const monthNumber = getMonthNumber(this.props.months, e.target.value);
    if (range.from.year === year && range.from.month === monthNumber.toString()) {
      return;
    }
    if (isFullYear(range)) {
      this.props.setNewState({ selectedYear: range.from.year });
    }
    const newRange = {
      from: range.from,
      to: { year, month: monthNumber.toString() },
    };
    this.props.setNewState({ range: {}, selectedRange: newRange });
  };

  // Calendar layout
  monthLayout = year => {
    var that = this;
    return this.props.months.map((month, key) => {
      const { range, selectedRange, isTouched } = this.props;
      let monthElement;
      if (isLeftCorner(year, key, range)) {
        if (isRightQuarterAndStart(year, key, range)) {
          monthElement = MonthSetup(key, isTouched, year, range, selectedRange, month, that);
        } else {
          monthElement = LeftRangeEndMonthButtonSetup(key, isTouched, year, range, selectedRange, month, that);
        }
      } else if (isRightCorner(year, key, range)) {
        //debugger;
        if (isLeftQuarterAndEnd(year, key, range)) {
          monthElement = MonthSetup(key, isTouched, year, range, selectedRange, month, that);
        } else {
          monthElement = RightRangeEndMonthButtonSetup(key, isTouched, year, range, selectedRange, month, that);
        }
      } else {
        if (isRightQuarter(year, key, range)) {
          monthElement = RightQuarterMonthButtonSetup(key, isTouched, year, range, selectedRange, month, that);
        } else if (isLeftQuarter(year, key, range)) {
          monthElement = LeftQuarterMonthButtonSetup(key, isTouched, year, range, selectedRange, month, that);
        } else {
          monthElement = MonthSetup(key, isTouched, year, range, selectedRange, month, that);
        }
      }
      return monthElement;
    });
  };

  // Touch events
  onTouchStartMonth = (e, year) => {
    const { range } = this.props;

    this.props.setNewState({ isTouched: true });
    const target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    const monthNumber = getMonthNumber(this.props.months, target.value);
    if (!range.from) {
      this.props.setNewState({
        range: { from: { year, month: monthNumber.toString() } },
        selectedRange: {},
        selectedYear: "",
      });
      return;
    }
    const newRange = {
      from: range.from,
      to: { year, month: monthNumber.toString() },
    };
    this.props.setNewState({ range: {}, selectedRange: newRange });
  };

  onTouchMoveMonth = e => {
    const { range } = this.props;
    if (!range.from) return;

    const target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    const year = target.id.split("-")[1];
    if (!year) return;
    const monthNumber = getMonthNumber(this.props.months, target.value);
    this.props.setNewState({
      range: { from: range.from, to: { year, month: monthNumber.toString() } },
    });
  };

  onTouchEndMonth = e => {
    const { range } = this.props;
    if (!range.from) return;

    const target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    const year = target.id.split("-")[1];
    const monthNumber = getMonthNumber(this.props.months, target.value);
    if (!year || (range.from.year === year && range.from.month === monthNumber.toString())) {
      return;
    }
    if (isFullYear(range)) {
      this.props.setNewState({ selectedYear: range.from.year });
    }
    const newRange = {
      from: range.from,
      to: { year, month: monthNumber.toString() },
    };
    this.props.setNewState({ range: {}, selectedRange: newRange });
  };

  render() {
    const months = this.monthLayout(this.props.year);
    return (
      <Container className="remove-padding">
        <Row xs={3} className="margin-change">
          <Col xs={4} className="remove-padding">
            {months[0]}
          </Col>
          <Col xs={4} className="remove-padding">
            {months[1]}
          </Col>
          <Col xs={4} className="remove-padding">
            {months[2]}
          </Col>
        </Row>
        <Row xs={3} className="margin-change">
          <Col xs={4} className="remove-padding">
            {months[3]}
          </Col>
          <Col xs={4} className="remove-padding">
            {months[4]}
          </Col>
          <Col xs={4} className="remove-padding">
            {months[5]}
          </Col>
        </Row>
        <Row xs={3} className="margin-change">
          <Col xs={4} className="remove-padding">
            {months[6]}
          </Col>
          <Col xs={4} className="remove-padding">
            {months[7]}
          </Col>
          <Col xs={4} className="remove-padding">
            {months[8]}
          </Col>
        </Row>
        <Row xs={3} className="margin-change">
          <Col xs={4} className="remove-padding">
            {months[9]}
          </Col>
          <Col xs={4} className="remove-padding">
            {months[10]}
          </Col>
          <Col xs={4} className="remove-padding">
            {months[11]}
          </Col>
        </Row>
      </Container>
    );
  }
}

TwelveMonthPicker.propTypes = {
  year: PropTypes.string,
  months: PropTypes.instanceOf(Array),
  range: PropTypes.instanceOf(Object),
  selectedRange: PropTypes.shape({
    from: PropTypes.object,
    to: PropTypes.object,
  }),
  isTouched: PropTypes.bool,
  setNewState: PropTypes.func,
};
