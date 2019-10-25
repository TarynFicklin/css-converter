import React, { Component } from 'react'
import './App.css';

import dummyData          from './helpers/dummyData'
import outputEffects      from './helpers/outputEffects'
import convertHeader      from './helpers/convertHeader'
import toKebabCase        from './helpers/toKebabCase'
import removeDoubleQuotes from './helpers/removeDoubleQuotes'
import convertCommas      from './helpers/convertCommas'

class App extends Component {

  state = {
    cssInput  : dummyData,
    cssOutput : '',
    outputBG  : outputEffects().initial,
    copied    : false
  };

  handleInput = (event, target) => this.setState({[target]: event})

  pasteClipboard = async () => {
    this.refs.cssInput.select();
    this.setState({cssInput: await navigator.clipboard.readText()})
  }

  convertCSS = async () => {
    const { cssInput } = this.state
    let lines = []

    // await this.pasteClipboard()
    lines = cssInput.split('\n')
    let foundBracket = false

    lines = lines.map(line => {
      
      // stores the line's indents, then removes them
      const lineIndents = line ? ' '.repeat(line.search(/\S/)) : ''
      line = line.trim()

      // splits the lines based off of 
      const isSubSelector = line.charAt(1) === '&'
      line = line.split(isSubSelector ? '":' : ':')

      let isHeader = false

      if (line.length === 2) {

          let key = line[0]
          let val = line[1]

          val.slice(-2) === '({' && (isHeader = true)

          if (isHeader) {

            line = convertHeader(key)

          } else {

            if (key) {
              key = removeDoubleQuotes(key)
              key = toKebabCase(key)
            }
  
            if (val) {
              val = val.trim()
              val = removeDoubleQuotes(val)
              val = convertCommas(val)
              
              val.includes('{') && (foundBracket = true)
              !val.includes(';') && !val.includes('{') && (val = `${val};`)
            }
  
            // restore the line array
            line = [key, val]

          }

      } else {
        line[0].includes('{') && (foundBracket = true)
        !foundBracket && line[0].includes('})') && (line[0] = '`')
        line[0].includes('}') && (foundBracket = false)
      }

      // restore the line
      line = line.join(': ')
      line = `${lineIndents}${line}`

      return line
      
    })

    // restore the lines
    lines = lines.join('\n')
    this.copyCSSOutput(lines)
  }

  copyCSSOutput = input => {

    this.refs.cssOutput.select()
    document.execCommand('copy')

    setTimeout( () => this.setState(outputEffects(input).flash), 0    )
    setTimeout( () => this.setState(outputEffects().cooldown),   500  )
    setTimeout( () => this.setState(outputEffects().done),       2000 )

  }

  render() {
  
    const { pasteClipboard, handleInput, convertCSS, copyCSSOutput } = this
    const { cssInput, cssOutput, outputBG, copied } = this.state

    return (
      <div className="App">

        <div className="css-converter">

          <div>
            <h5>Input</h5>
            <textarea
              className="css-input"
              value={cssInput}
              ref="cssInput"
              // onClick={() => pasteClipboard()}
              onChange={e => handleInput(e.target.value, 'cssInput')}
            />
          </div>

          <div>
            <h5>Output</h5>
            <textarea
              className="css-output"
              value={cssOutput}
              style={outputBG}
              ref="cssOutput"
              onClick={() => copyCSSOutput()}
              readOnly
            />
          </div>

        </div>

        <button
          className="convert-button"
          onClick={() => convertCSS()}>
          {copied ? 'Copied' : 'Convert'}
        </button>

      </div>
    )
  }
}

export default App;