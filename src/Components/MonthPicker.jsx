import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styled from "styled-components";
import Grid from "react-bootstrap/lib/Grid";
import Row from "react-bootstrap/lib/Row";
import Col from "react-bootstrap/lib/Col";
import {
  isInRange,
  isLeftCorner,
  isRightCorner,
  isDisabled,
  isFullYear,
  getMonthNumber,
  isLeftQuarter,
  isLeftQuarterAndEnd,
  isRightQuarter,
  isRightQuarterAndStart,
} from "./utils/monthPicker";

const MonthPickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  transform: ${props => (props.yearTranslateStyle ? `translate(-${props.yearTranslateStyle})` : "")};
  transition: 0.2s ease-in-out;
  width: ${props => (props.containerTotalWidth ? props.containerTotalWidth : "")};
`;

const RowArea = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 5px;
  width: 117px;
`;

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

const Year = styled.button`
  display: block;
  margin: auto;

  border: none !important;
  align-self: center;
  background: white !important;
  color: #122442 !important;
  border-radius: 24px !important;

  height: 36px;
  width: 70px;
  font-weight: normal;
  font-size: 13px !important;
  font-family: Qlikview Sans !important;
  cursor: pointer;

  &.btn-selected {
    background-color: #092642 !important;
    background: #5dcedb !important;
    color: white !important;
  }
  &.hover-active:hover {
    background-color: #092642 !important;
    color: white !important;
  }
  &:active {
    background-color: #092642 !important;
    color: white !important;
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
      key={key}
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

class MonthPicker extends Component {
  constructor(props) {
    super(props);
    this.onMouseDownMonth = this.onMouseDownMonth.bind(this);
    this.onMouseMoveMonth = this.onMouseMoveMonth.bind(this);
    this.onMouseUpMonth = this.onMouseUpMonth.bind(this);
    this.onYearClick = this.onYearClick.bind(this);
    this.onTouchStartMonth = this.onTouchStartMonth.bind(this);
    this.onTouchMoveMonth = this.onTouchMoveMonth.bind(this);
    this.onTouchEndMonth = this.onTouchEndMonth.bind(this);
    this.setScroll = this.setScroll.bind(this);
    this.monthLayout = this.monthLayout.bind(this);
    this.yearLayout = this.yearLayout.bind(this);

    const { years, defaultRange } = this.props;

    this.years = years || [new Date().getFullYear()];
    this.months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    this.selectedRange = defaultRange && defaultRange.from && defaultRange.to ? defaultRange : {};

    this.state = {
      isTouched: false,
      selectedYear: isFullYear(this.selectedRange) ? this.selectedRange.from.year : "",
      selectedRange: this.selectedRange,
      scroll: 0,
      range: {},
    };
  }

  componentDidMount = () => {
    this.setState({ scroll: 201.11 * (this.years.length + 1) });
  };

  componentDidUpdate = () => {
    const { scroll } = this.state;
    const container = this.bodywrapper;
    if (!container) return;
    container.scrollTop = scroll;
  };

  setScroll = offsetTop => {
    const container = this.bodywrapper;
    const position = offsetTop - container.scrollTop;
    if (position > 350) this.setState({ scroll: container.scrollTop + 30 });
    else this.setState({ scroll: container.scrollTop });
  };

  // Mouse events
  onMouseDownMonth = (e, year) => {
    const { isTouched, range } = this.state;
    const { onChange } = this.props;
    if (isTouched === true) return;

    const monthNumber = getMonthNumber(this.months, e.target.value);
    if (!range.from) {
      const container = this.bodywrapper;
      this.setState({ range: { from: { year, month: monthNumber.toString() } } });
      this.setState({ scroll: container.scrollTop });
      this.setState({ selectedRange: {} });
      this.setState({ selectedYear: "" });
      this.props.onRangeChange({ range: { from: { year, month: monthNumber.toString() } } });
      return;
    }
    const newRange = {
      from: range.from,
      to: { year, month: monthNumber.toString() },
    };
    this.setState({ range: {} });
    this.setState({ selectedRange: newRange });
    this.setScroll(e.target.offsetTop);
    onChange(newRange);
  };

  onMouseMoveMonth = (e, year) => {
    const { isTouched, range } = this.state;
    if (!range.from || !!isTouched) return;

    const monthNumber = getMonthNumber(this.months, e.target.value);
    this.setState({
      range: { from: range.from, to: { year, month: monthNumber.toString() } },
    });
    this.setScroll(e.target.offsetTop);
    this.props.onRangeChange({
      range: { from: range.from, to: { year, month: monthNumber.toString() } },
    });
  };

  onMouseUpMonth = (e, year) => {
    const { isTouched, range } = this.state;
    const { onChange } = this.props;
    if (!range.from || !!isTouched) return;

    const monthNumber = getMonthNumber(this.months, e.target.value);
    if (range.from.year === year && range.from.month === monthNumber.toString()) {
      return;
    }
    if (isFullYear(range)) {
      this.setState({ selectedYear: range.from.year });
    }
    const newRange = {
      from: range.from,
      to: { year, month: monthNumber.toString() },
    };
    this.setState({ range: {} });
    this.setState({ selectedRange: newRange });
    this.setScroll(e.target.offsetTop);
    onChange(newRange);
  };

  onYearClick = e => {
    const { onChange } = this.props;
    const month =
      e.target.value === new Date().getFullYear().toString() ? (new Date().getMonth() + 1).toString() : "12";
    const newRange = {
      from: { year: e.target.value, month: "1" },
      to: { year: e.target.value, month },
    };
    this.setState({ selectedYear: e.target.value });
    this.setState({ range: {} });
    this.setState({ selectedRange: newRange });
    this.setScroll(e.target.offsetTop);
    onChange(newRange);
  };

  // Touch events
  onTouchStartMonth = (e, year) => {
    const { range } = this.state;
    const { onChange } = this.props;

    this.setState({ isTouched: true });
    const target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    const monthNumber = getMonthNumber(this.months, target.value);
    if (!range.from) {
      const container = this.bodywrapper;
      this.setState({ range: { from: { year, month: monthNumber.toString() } } });
      this.setState({ scroll: container.scrollTop });
      this.setState({ selectedRange: {} });
      this.setState({ selectedYear: "" });
      return;
    }
    const newRange = {
      from: range.from,
      to: { year, month: monthNumber.toString() },
    };
    this.setState({ range: {} });
    this.setState({ selectedRange: newRange });
    this.setScroll(e.target.offsetTop);
    onChange(newRange);
  };

  onTouchMoveMonth = e => {
    const { range } = this.state;
    if (!range.from) return;

    const target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    const year = target.id.split("-")[1];
    if (!year) return;
    const monthNumber = getMonthNumber(this.months, target.value);
    this.setState({
      range: { from: range.from, to: { year, month: monthNumber.toString() } },
    });
    this.setScroll(e.target.offsetTop);
  };

  onTouchEndMonth = e => {
    const { range } = this.state;
    const { onChange } = this.props;
    if (!range.from) return;

    const target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    const year = target.id.split("-")[1];
    const monthNumber = getMonthNumber(this.months, target.value);
    if (!year || (range.from.year === year && range.from.month === monthNumber.toString())) {
      return;
    }
    if (isFullYear(range)) {
      this.setState({ selectedYear: range.from.year });
    }
    const newRange = {
      from: range.from,
      to: { year, month: monthNumber.toString() },
    };
    this.setState({ range: {} });
    this.setState({ selectedRange: newRange });
    this.setScroll(e.target.offsetTop);
    onChange(newRange);
  };

  // Calendar layout
  monthLayout = year => {
    var that = this;
    return this.months.map((month, key) => {
      const { range, selectedRange, isTouched } = this.state;
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

  yearLayout = year => {
    const { selectedYear, isTouched } = this.state;

    return (
      <Year
        className={classNames({
          "btn-year": true,
          "hover-active": !isTouched,
          "btn-selected": selectedYear === year,
        })}
        onClick={this.onYearClick}
        value={year}
      >
        {year}
      </Year>
    );
  };

  render() {
    const translateInPx = `${this.props.yearTranslateStyle * 117}px`; // this number is meaningful for design
    const containerTotalWidth = `${this.years.length * 117}px`;
    return (
      <MonthPickerContainer
        className="month-picker"
        length={this.years.length}
        ref={node => {
          this.bodywrapper = node;
        }}
        yearTranslateStyle={translateInPx}
        containerTotalWidth={containerTotalWidth}
      >
        {this.years.map((year, key) => {
          const months = this.monthLayout(year);
          return (
            <RowArea key={key}>
              <Grid style={{ height: "48px" }} className="remove-padding">
                <Row sm={12} className="margin-change">
                  <Col sm={12} className="remove-padding text-center">
                    {this.yearLayout(year)}
                  </Col>
                </Row>
              </Grid>
              <Grid className="remove-padding">
                <Row sm={3} className="margin-change">
                  <Col sm={4} className="remove-padding">
                    {months[0]}
                  </Col>
                  <Col sm={4} className="remove-padding">
                    {months[1]}
                  </Col>
                  <Col sm={4} className="remove-padding">
                    {months[2]}
                  </Col>
                </Row>
                <Row sm={3} className="margin-change">
                  <Col sm={4} className="remove-padding">
                    {months[3]}
                  </Col>
                  <Col sm={4} className="remove-padding">
                    {months[4]}
                  </Col>
                  <Col sm={4} className="remove-padding">
                    {months[5]}
                  </Col>
                </Row>
                <Row sm={3} className="margin-change">
                  <Col sm={4} className="remove-padding">
                    {months[6]}
                  </Col>
                  <Col sm={4} className="remove-padding">
                    {months[7]}
                  </Col>
                  <Col sm={4} className="remove-padding">
                    {months[8]}
                  </Col>
                </Row>
                <Row sm={3} className="margin-change">
                  <Col sm={4} className="remove-padding">
                    {months[9]}
                  </Col>
                  <Col sm={4} className="remove-padding">
                    {months[10]}
                  </Col>
                  <Col sm={4} className="remove-padding">
                    {months[11]}
                  </Col>
                </Row>
              </Grid>
            </RowArea>
          );
        })}
      </MonthPickerContainer>
    );
  }
}

MonthPicker.propTypes = {
  defaultRange: PropTypes.shape({
    from: PropTypes.object,
    to: PropTypes.object,
  }),
  years: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  onRangeChange: PropTypes.func,
};

export default MonthPicker;
