import * as React from "react";
import { connect } from "react-redux";
import "./Santoku.css";
import { Snippet } from "./Snippet";
import { PresentState, toPresentState } from "./store";

export const Santoku = (props: PresentState) => {
  return (
    <div className="Santoku">
      {props.steps.allSteps.map(stepId => (
        <Snippet key={stepId} />
      ))}
    </div>
  );
};

export default connect(toPresentState)(Santoku);
