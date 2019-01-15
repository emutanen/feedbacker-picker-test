import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TimeRangePicker from "./TimeRangePicker";
import "../Styles/Button.css";

const MarketIndexButtonGroup = ({ deleteButtonDisabled, openNewIndexModal, deleteIndexes }) => (
  <div className="btn-header">
    <button className="btn btn-outline" onClick={() => openNewIndexModal()}>
      New Market Index
    </button>
    <button className="btn btn-outline-circle" onClick={() => ({})}>
      <i className="fa fa-search" aria-hidden="true" />
    </button>
    <button className="btn btn-outline-circle" disabled={deleteButtonDisabled} onClick={() => deleteIndexes()}>
      <i className="fa fa-trash" aria-hidden="true" />
    </button>
    <TimeRangePicker />
  </div>
);

MarketIndexButtonGroup.propTypes = {
  deleteButtonDisabled: PropTypes.bool,
  openNewIndexModal: PropTypes.func,
  deleteIndexes: PropTypes.func,
};

export default connect()(MarketIndexButtonGroup);
