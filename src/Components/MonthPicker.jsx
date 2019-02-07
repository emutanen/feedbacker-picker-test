import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styled from "styled-components";
import TwelveMonthPicker from "./TwelveMonthPicker";
import { isFullYear } from "./utils/monthPicker";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../Styles/MonthPicker.css";

const MonthPickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  transform: ${props => (props.yearTranslateStyle ? `translate(-${props.yearTranslateStyle})` : "")};
  transition: 0.2s ease-in-out;
  width: ${props => (props.containerTotalWidth ? props.containerTotalWidth : "")};
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

const RowArea = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 5px;
  width: 117px;
`;

class MonthPicker extends Component {
  constructor(props) {
    super(props);
    this.onYearClick = this.onYearClick.bind(this);
    this.yearLayout = this.yearLayout.bind(this);

    const { years, defaultRange } = this.props;

    this.years = years || [new Date().getFullYear()];
    this.months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    // this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    this.selectedRange = defaultRange && defaultRange.from && defaultRange.to ? defaultRange : {};

    this.state = {
      isTouched: false,
      selectedYear: isFullYear(this.selectedRange) ? this.selectedRange.from.year : "",
      selectedRange: this.selectedRange,
      range: {},
    };
  }

  setNewState = state => {
    this.setState(state);
  };

  onYearClick = e => {
    const { onChange } = this.props;
    const month =
      e.target.value === new Date().getFullYear().toString() ? (new Date().getMonth() + 1).toString() : "12";
    const newRange = {
      from: { year: e.target.value, month: "1" },
      to: { year: e.target.value, month },
    };
    this.setState({ selectedYear: e.target.value, range: {}, selectedRange: newRange });
    onChange(newRange);
  };

  yearLayout = year => {
    const { selectedYear, isTouched } = this.state;

    return (
      <Year
        key={year}
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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.range !== prevState.range) {
      this.props.onRangeChange(this.state.range);
    }
    if (this.state.selectedRange.to !== prevState.selectedRange.to) {
      this.props.onChange(this.state.selectedRange);
    }
  }

  render() {
    const translateInPx = `${this.props.yearTranslateStyle * 117}px`; // this number is meaningful for design
    const containerTotalWidth = `${this.years.length * 117}px`;
    const inlineStyles = {
      display: "flex",
      flexDirection: "row",
      position: "relative",
      transform: this.props.yearTranslateStyle ? `translate(-${this.props.yearTranslateStyle})` : "",
      transition: "0.2s ease-in-out",
      width: this.props.containerTotalWidth ? this.props.containerTotalWidth : "",
    };

    return (
      <MonthPickerContainer
        className="month-picker"
        style={inlineStyles}
        length={this.years.length}
        yearTranslateStyle={translateInPx}
        containerTotalWidth={containerTotalWidth}
      >
        {this.years.map((year, key) => {
          return (
            <RowArea key={`area-${year}`} className="row-area-supplemental">
              <Container style={{ height: "48px" }} className="remove-padding">
                <Row sm={12} className="margin-change">
                  <Col sm={12} className="remove-padding text-center">
                    {this.yearLayout(year)}
                  </Col>
                </Row>
              </Container>
              <TwelveMonthPicker
                key={`101${year}`}
                year={year}
                months={this.months}
                range={this.state.range}
                selectedRange={this.state.selectedRange}
                isTouched={this.state.isTouched}
                setNewState={state => this.setNewState(state)}
              />
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
