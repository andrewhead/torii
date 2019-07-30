import * as React from 'react'
import { connect, Provider } from 'react-redux'
import logo from './logo.svg'
import './Santoku.css'
import { SantokuState } from './store'
import { updateIndex, updateText } from './store/line/actions'
import { Line } from './store/line/types'

interface SantokuProps {
  line: Line
  updateIndex: typeof updateIndex
  updateText: typeof updateText
}

const mapStateToProps = (state: SantokuState) => ({
  line: state.line
})

export const Santoku = (props: SantokuProps) => {
  return (
    <div className="Santoku">
    <header className="Santoku-header">
      <img src={logo} className="Santoku-logo" alt="logo" />
      <h1 className="Santoku-title">Welcome to React</h1>
    </header>
    <p className="Santoku-intro">
      To get started, edit <code>src/Santoku.tsx</code> and save to reload.
    </p>
    <p className="line" onClick={() => props.updateText("The text was updated with Redux.") }>
      Additional message: { props.line.text }
    </p>
  </div>
  )
}

export default connect(
  mapStateToProps,
  { updateIndex, updateText }
)(Santoku);