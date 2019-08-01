import * as React from 'react';
import { connect } from 'react-redux';
import './Santoku.css';
import { Snippet } from './Snippet';
import { SantokuState } from './store';

const mapStateToProps = (state: SantokuState) => (state)

export const Santoku = (props: SantokuState) => {
  return (
    <div className="Santoku">
      {Array.from(
        new Array(props.steps.allSteps.present.length),
        () => (
           <Snippet /> 
        )
      )}
    </div>
  )
}

export default connect(
  mapStateToProps
)(Santoku);
