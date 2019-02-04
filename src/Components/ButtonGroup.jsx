import React from "react";
import { connect } from "react-redux";
import TimeRangePicker from "./TimeRangePicker";
import "../Styles/Button.css";

const MarketIndexButtonGroup = () => (
  <div>
    <h1 className="headline">Test by clicking the button and selecting a time range.</h1>
    <div className="instruction" style={{ width: "600px" }}>
      <h2>* It is possible to select a starting point.</h2>
      <h2>* It is possible to click arrow button to go back max 10 years.</h2>
      <h2>* Upon opening, the picker will always open from the current year.</h2>
      <h2>* The selection can be applied until the current month that we live in.</h2>
      <h2>* There is no future time selection support.</h2>
    </div>
    <TimeRangePicker />
    <h1 className="comments">
      Let use know your comments to the right{" "}
      <span role="img" aria-label="Finger pointing to the right side of the page.">
        👉
      </span>
    </h1>
  </div>
);

export default connect()(MarketIndexButtonGroup);
