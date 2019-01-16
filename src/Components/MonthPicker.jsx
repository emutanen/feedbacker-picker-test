import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styled from "styled-components";
import { isInRange, isLeftCorner, isRightCorner, isDisabled, isFullYear, getMonthId } from "./utils/monthPicker";

const MonthPickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow: auto;
`;

const RowArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Area = styled.div`
  display: -ms-grid;
  display: grid;
  grid-template-rows: repeat(auto-fill, minmax(64px, 1fr));
  background-color: transparent;
  margin: 1px;
`;

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 3px;
  margin-right: 3px;
  -ms-grid-row: 1;
  -ms-grid-column: 2;
`;

const YearGrid = styled.div`
  display: flex;
  box-shadow: 0 0 0 1px #e7e7e7 !important;
  justify-content: center;
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

  color: #164d85 !important;
  background-color: white;

  &.btn-selected {
    background-color: #164d85 !important;
    color: white;
    z-index: 4 !important;
  }
  &.hover-active:hover:not(.btn-corner):not(:disabled) {
    background-color: #092642 !important;
    border-radius: 100%;
    color: white !important;
    z-index: 5 !important;
  }
  &.btn-range {
    background: #164d85 !important;
    color: white !important;
    z-index: 4 !important;
  }
  &.btn-range-endpoint-left {
    background: #092642 !important;
    border-radius: 100%;
    color: white !important;
    z-index: 5 !important;
  }
  &.btn-range-endpoint-right {
    background: #092642 !important;
    border-radius: 100%;
    color: white !important;
    z-index: 5 !important;
  }
  &:disabled {
    color: #9aa2ae !important;
    background: #f5f7f7 !important;
    box-shadow: 0 0 0 1px #e7e7e7 !important;
    cursor: auto !important;
  }
  &:active {
    background: #092642 !important;
    color: white !important;
  }
`;

const Year = styled.button`
  align-self: center;
  background: white !important;
  color: #122442 !important;
  border: none !important;
  border-radius: 50% !important;
  outline: none !important;
  padding: 20px;
  height: 70px;
  width: 70px;
  font-weight: normal;
  font-size: 13px !important;
  font-family: Qlikview Sans !important;
  cursor: pointer;

  &.btn-selected {
    background: #5dcedb !important;
    color: white !important;
    box-shadow: 0 0 0 1px #4fbecb !important;
  }
  &.hover-active:hover {
    background: #7c55c0 !important;
    color: white !important;
    box-shadow: 0 0 0 1px #6947a4 !important;
  }
  &:active {
    background: #5dcedb !important;
    color: white !important;
    box-shadow: 0 0 0 1px #4fbecb !important;
  }
`;

const LeftRangeEndMonthSetup = (key, isTouched, year, range, selectedRange, month, that) => (
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

const RightRangeEndMonthSetup = (key, isTouched, year, range, selectedRange, month, that) => (
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
        "btn-range": isInRange(year, key + 1, range),
        "btn-range-endpoint-left": isLeftCorner(year, key + 1, range),
        "btn-range-endpoint-right": isRightCorner(year, key + 1, range),
        "btn-selected": isInRange(year, key + 1, selectedRange), // isCorner(year, key + 1, selectedRange)
      })}
      value={month}
      id={`${month}-${year}`}
      disabled={!!isDisabled(year, key + 1, range)}
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

    const monthId = getMonthId(this.months, e.target.value);
    if (!range.from) {
      const container = this.bodywrapper;
      this.setState({ range: { from: { year, month: monthId.toString() } } });
      this.setState({ scroll: container.scrollTop });
      this.setState({ selectedRange: {} });
      this.setState({ selectedYear: "" });
      return;
    }
    const newRange = {
      from: range.from,
      to: { year, month: monthId.toString() },
    };
    this.setState({ range: {} });
    this.setState({ selectedRange: newRange });
    this.setScroll(e.target.offsetTop);
    onChange(newRange);
  };

  onMouseMoveMonth = (e, year) => {
    const { isTouched, range } = this.state;
    if (!range.from || !!isTouched) return;

    const monthId = getMonthId(this.months, e.target.value);
    this.setState({
      range: { from: range.from, to: { year, month: monthId.toString() } },
    });
    this.setScroll(e.target.offsetTop);
  };

  onMouseUpMonth = (e, year) => {
    const { isTouched, range } = this.state;
    const { onChange } = this.props;
    if (!range.from || !!isTouched) return;

    const monthId = getMonthId(this.months, e.target.value);
    if (range.from.year === year && range.from.month === monthId.toString()) {
      return;
    }
    if (isFullYear(range)) {
      this.setState({ selectedYear: range.from.year });
    }
    const newRange = {
      from: range.from,
      to: { year, month: monthId.toString() },
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
    const monthId = getMonthId(this.months, target.value);
    if (!range.from) {
      const container = this.bodywrapper;
      this.setState({ range: { from: { year, month: monthId.toString() } } });
      this.setState({ scroll: container.scrollTop });
      this.setState({ selectedRange: {} });
      this.setState({ selectedYear: "" });
      return;
    }
    const newRange = {
      from: range.from,
      to: { year, month: monthId.toString() },
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
    const monthId = getMonthId(this.months, target.value);
    this.setState({
      range: { from: range.from, to: { year, month: monthId.toString() } },
    });
    this.setScroll(e.target.offsetTop);
  };

  onTouchEndMonth = e => {
    const { range } = this.state;
    const { onChange } = this.props;
    if (!range.from) return;

    const target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    const year = target.id.split("-")[1];
    const monthId = getMonthId(this.months, target.value);
    if (!year || (range.from.year === year && range.from.month === monthId.toString())) {
      return;
    }
    if (isFullYear(range)) {
      this.setState({ selectedYear: range.from.year });
    }
    const newRange = {
      from: range.from,
      to: { year, month: monthId.toString() },
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
      if (isLeftCorner(year, key + 1, range)) {
        monthElement = LeftRangeEndMonthSetup(key, isTouched, year, range, selectedRange, month, that);
      } else if (isRightCorner(year, key + 1, range)) {
        monthElement = RightRangeEndMonthSetup(key, isTouched, year, range, selectedRange, month, that);
      } else {
        monthElement = MonthSetup(key, isTouched, year, range, selectedRange, month, that);
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
    return (
      <MonthPickerContainer
        className="month-picker"
        length={this.years.length}
        ref={node => {
          this.bodywrapper = node;
        }}
      >
        {this.years.map((year, key) => (
          <RowArea key={key}>
            <Area className="grid-area">
              <YearGrid>{this.yearLayout(year)}</YearGrid>
              <MonthGrid>{this.monthLayout(year)}</MonthGrid>
            </Area>
          </RowArea>
        ))}
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
};

export default MonthPicker;