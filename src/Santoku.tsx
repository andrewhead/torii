import * as React from "react";
import { connect } from "react-redux";
import { State, Text } from "santoku-store";
import "./Santoku.scss";
import Snippet from "./Snippet";

export function Santoku(props: SantokuProps) {
  return (
    <div className="Santoku">
      {props.text.snippets.all.map(snippetId => (
        <Snippet id={snippetId} key={snippetId} />
      ))}
    </div>
  );
}

interface SantokuProps {
  text: Text;
}

export default connect((state: State) => {
  return { text: state.text.present };
})(Santoku);
