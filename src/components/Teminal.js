import React from 'react'
import Terminal from 'react-animated-term'
import 'react-animated-term/dist/react-animated-term.css'

const termLines = [
  {
    'text': 'ls',
    'cmd': true
  },
  {
    'text': 'index.js    package.json    node_modules',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

class TerminalApp extends React.Component {
  constructor(props) {
    super(props);
    this.lines = props.lines || {termLines};
    this.interval = props.interval || 80;
    this.height = props.height || 240;
  }
  render() {
    return (
      <Terminal
        lines={this.lines}
        interval={this.interval}
        height={this.height}
      />
    )
  }
}

export {TerminalApp} ;