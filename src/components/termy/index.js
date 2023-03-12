import React from 'react';
import "./data/termynal.css";


const defaultOptions = {
    startDelay: 600,
    typeDelay: 90,
    lineDelay: 1500,
    progressLength: 40,
    progressChar: '█',
    progressPercent: 100,
    cursor: '▋',
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.id || "termynal";
    this.originalStartDelay = this.startDelay = props.startDelay || defaultOptions.startDelay;
    this.originalTypeDelay = this.typeDelay = props.typeDelay || defaultOptions.typeDelay;
    this.originalLineDelay = this.lineDelay = props.lineDelay || defaultOptions.lineDelay;
    this.progressLength = props.progressLength || defaultOptions.progressLength;
    this.progressChar = props.progressChar || defaultOptions.progressChar;
    this.progressPercent = props.progressPercent || defaultOptions.progressPercent;
    this.cursor = props.cursor || defaultOptions.cursor;
    this.children = (props.children || []).map((v) => new DataLine(v.props));
    this.fastVisible = 'visible';
    this.restartVisible = 'hidden';
    //this.init();
  }
  render() {
    return (
      <div id={this.id} data-termynal="">
        <a href='#'
           style={{visibility: this.fastVisible}}
           onClick={(e) => {
            e.preventDefault()
            this.lineDelay = 0
            this.typeDelay = 0
            this.startDelay = 0
        }} data-terminal-control=''>fast →</a>
        {this.children.map((v) => v.render())}
        <a href='#'
           style={{visibility: this.restartVisible}}
           onClick={(e) => {
            e.preventDefault()
            this.init()
        }} data-terminal-control=''>restart ↻</a>
      </div>
    )
  }

  componentDidMount() {
    this.init();
  }

  init() {
    for (let line of this.children) {
      line.visibility = 'hidden'
    }
    this.fastVisible = 'visible';
    this.restartVisible = 'hidden';
    this.start();
  }

  async start() {
    await this._wait(this.startDelay);
    for (let line of this.children) {

      const type = line.data.type;
      const delay = line.data.delay || this.lineDelay;

      if (type === 'input') {
          line.data.cursor = this.cursor;
          await this.type(line);
          await this._wait(delay);
      }

      else if (type === 'progress') {
          await this.progress(line);
          await this._wait(delay);
      }

      else {
        line.visibility = 'visible';
        await this._wait(delay);
        this.forceUpdate()
      }
      if (type === 'input') {
        line.data.cursor = undefined;
        this.forceUpdate()
      }
    }
    this.lineDelay = this.originalLineDelay
    this.typeDelay = this.originalTypeDelay
    this.startDelay = this.originalStartDelay
    this.fastVisible = 'hidden';
    this.restartVisible = 'visible';
    this.forceUpdate()
  }

  /**
   * Animate a typed line.
   * @param {DataLine} line - The line element to render.
   */
  async type(line) {
    const chars = [...line.data.value];
    line.data.value = '';
    line.visibility = 'visible';
    for (let char of chars) {
      const delay = line.data.typeDelay || this.typeDelay;
      await this._wait(delay);
      line.data.value += char;
      this.forceUpdate()
    }
  }

  /**
   * Animate a progress bar.
   * @param {DataLine} line - The line element to render.
   */
  async progress(line) {
    const progressLength = line.data.progressLength || this.progressLength;
    const progressChar = line.data.progressChar || this.progressChar;
    const chars = progressChar.repeat(progressLength);
    const progressPercent = line.data.progressPercent || this.progressPercent;
    line.data.value = '';
    line.visibility = 'visible';
    for (let i = 1; i < chars.length + 1; i++) {
      await this._wait(this.typeDelay);
      const percent = Math.round(i / chars.length * 100);
      line.data.value = `${chars.slice(0, i)} ${percent}%`;
      this.forceUpdate()
      if (percent>progressPercent) {
        break;
      }
    }
  }

  /**
   * Helper function for animation delays, called with `await`.
   * @param {number} time - Timeout, in ms.
   */
  _wait(time) {
      return new Promise(resolve => setTimeout(resolve, time));
  }
}

class DataLine extends React.Component {
  constructor(props) {
    super(props);
    this.visibility = 'visible'
    this.data = {};
    this.data.type = props.type;
    this.data.cursor = props.cursor;
    this.data.value = props.value || props.children;
    this.data.delay = props.delay;
    this.data.typeDelay = props.typeDelay;
    this.data.prompt = props.prompt;
    this.data.progressLength = props.progressLength;
    this.data.progressChar = props.progressChar;
    this.data.progressPercent = props.progressPercent;
  }

  _attributes() {
    let attrs = {style: {visibility: this.visibility}};
    for (let prop of Object.keys(this.data)) {
        let value = this.data[prop];
        if (value === undefined || value === null) {
          continue;
        }
        // Custom add class
        if (prop === 'class') {
          attrs.class = `${value}`
          continue
        }
        if (prop === 'type') {
          attrs['data-ty'] = `${value}`
        } else if (prop !== 'value') {
          attrs[`data-ty-${prop.toLowerCase()}`] = value
        }
    }
    return attrs;
  }
  render() {
    return (
      <span {...this._attributes()}>{this.data.value || ''}</span>
    );
  }
}

class Input extends DataLine {
  constructor(props) {
    super(props);
    this.data.type = 'input';
  }
}

class Progress extends DataLine {
  constructor(props) {
    super(props);
    this.data.type = 'progress';
  }
}




export {App, DataLine, Input, Progress} ;
