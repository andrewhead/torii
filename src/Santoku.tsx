import * as React from "react";
import { connect } from "react-redux";
import { State, toPresentState } from "santoku-store";
import "./Santoku.scss";
import { Snippet } from "./Snippet";

export const Santoku = (props: State) => {
  return (
    <div className="Santoku">
      {props.steps.allSteps.map(stepId => (
        <Snippet key={stepId} />
      ))}
    </div>
  );
};

export default connect(toPresentState)(Santoku);
