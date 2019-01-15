import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import classNames from "classnames";

const YearPickerContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  align-items: center;
  justify-items: center;

  ::-webkit-scrollbar-thumb {
    background: #a4a4a4;
  }
  ::-webkit-scrollbar {
    width: 25px;
  }
`;

const Year = styled.button`
  width: 64px;
  height: 64px;
  border-radius: 100%;

  background: white;
  color: #002753;
  outline: none;
  margin: 10px 24px 0px 24px;
  font-size: 24px;
  font-family: Qlikview Sans;
  cursor: pointer;
  touch-action: none;

  &.btn-selected {
    background: #002753;
    color: white;
    box-shadow: 0 0 0 1 #002753;
    z-index: 5;
  }

  &.hover {
    background: #002753 !important;
    color: white !important;
    box-shadow: 0 0 0 1 #002753 !important;
    z-index: 6;
  }

  &.disabled {
    color: #9aa2ae;
    background: #f5f7f7;
    box-shadow: 0 0 0 1px #e7e7e7;
    cursor: auto;
    z-index: 4;
  }

  &.btn-corner {
    background: #002753;
    color: white;
    box-shadow: 0 0 0 1px #002753;
    z-index: 8;
  }
`;

const isInRange = (year, range) => {
  if (!range) {
    console.error("isInRange called with invalid values!", year, range);
    return false;
  }
  const yearInt = Number(year); // year is always available
  const yearFrom = Number(range.from.year); // range.from is always available
  let yearTo = range.from.year; // initial guess for target year is the start year, that's the default
  if (range.to) {
    // Test whether range.to is available
    yearTo = Number(range.to.year);
  } else {
    return year === range.from.year;
  }
  return yearFrom <= yearInt && yearInt <= yearTo;
};

class YearPicker extends Component {
  constructor(props) {
    super(props);
    this.onMouseDownYear = this.onMouseDownYear.bind(this);
    this.onMouseMoveYear = this.onMouseMoveYear.bind(this);
    this.onMouseUpYear = this.onMouseUpYear.bind(this);
    this.onTouchStartYear = this.onTouchStartYear.bind(this);
    this.onTouchMoveYear = this.onTouchMoveYear.bind(this);
    this.onTouchEndYear = this.onTouchEndYear.bind(this);
    this.onYearClick = this.onYearClick.bind(this);
    this.onYearHover = this.onYearHover.bind(this);
    this.setRangeStart = this.setRangeStart.bind(this);
    this.setRangeEnd = this.setRangeEnd.bind(this);
    this.years = this.props.years || [new Date().getFullYear()];

    this.selectedRange =
      this.props.defaultRange && this.props.defaultRange.from && this.props.defaultRange.to
        ? this.props.defaultRange
        : {};

    this.state = {
      isTouched: false,
      selectedRange: this.selectedRange,
      scroll: 0,
      range: {},
    };
  }

  // Mouse events
  onMouseDownYear(e) {
    // touch screen used
    if (this.state.isTouched) return;
    if (!this.state.range.from) {
      this.setRangeStart({ year: e.target.value, month: "1" });
    } else {
      this.setRangeEnd({ year: e.target.value, month: "12" });
    }
  }

  onMouseMoveYear(e) {
    if (!this.state.range.from || !!this.state.isTouched) return;
    this.setState({ range: { from: this.state.range.from, to: { year: e.target.value, month: "12" } } });
  }

  onMouseUpYear(e) {
    const year = e.target.value;
    // no from, touch screen used
    if (!this.state.range.from || !!this.state.isTouched) return;
    // user has clicked only start date
    if (this.state.range.from.year === year) return;
    this.setRangeEnd({ year, month: "12" });
  }

  onYearClick(e) {
    const year = e.target.value || new Date().getFullYear().toString();
    const newRange = { from: { year, month: "1" }, to: { year, month: "12" } };
    this.setState({ range: newRange });
    this.props.onChange(newRange);
  }

  onYearHover(e) {
    console.group("onHover:");
    console.log("HOVER");
    const year = e.target.value;
    console.log("Year recovered is: ", year);
    console.log("Range starts from: ", this.state.range.from);
    console.groupEnd();
    if (this.state.range.from) {
      const newRange = { from: this.state.range.from, to: { year, month: "12" } };
      this.setState({ range: newRange });
    }
  }

  // Touch events

  onTouchStartYear(e) {
    this.setState({ isTouched: true });
    const target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    if (!this.state.range.from) {
      this.setRangeStart({ year: target.value, month: "1" });
    } else {
      this.setRangeEnd({ year: target.value, month: "12" });
    }
  }

  onTouchMoveYear(e) {
    if (!this.state.range.from) return;
    const target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[1].clientY);
    this.setRangeEnd({ year: target.value, month: "12" });
  }

  onTouchEndYear(e) {
    if (!this.state.range.from) return;
    const target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    if (this.state.range.from.year === target.value) return;
    this.setRangeEnd({ year: target.value, month: "12" });
  }

  setRangeStart(from) {
    this.setState({ range: { from } });
    this.setState({ selectedRange: {} });
  }

  setRangeEnd(to) {
    const newRange = { from: this.state.range.from, to };
    this.setState({ range: newRange });
    this.props.onChange(newRange);
  }

  render() {
    return (
      <YearPickerContainer
        className="year-picker"
        length={this.years.length}
        ref={node => {
          this.bodywrapper = node;
        }}
      >
        {this.years.map((year, key) => (
          <Year
            key={key}
            className={classNames({
              "btn-year": true,
              "btn-selected": this.state.range.end ? isInRange(year, this.state.range) : false,
            })}
            onClick={this.onYearClick}
            onMouseEnter={this.onYearHover}
            value={year}
          >
            {year}
          </Year>
        ))}
      </YearPickerContainer>
    );
  }
}

YearPicker.propTypes = {
  defaultRange: PropTypes.shape({ from: PropTypes.object, to: PropTypes.object }),
  years: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

export default YearPicker;
