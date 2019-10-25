import React, { Component } from 'react'
import './App.css';

import dummyData     from './helpers/dummyData'
import outputEffects from './helpers/outputEffects'
import cssConversion from './helpers/cssConversion'

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

    const {
      storeIndents,
      isKeyValuePair,
      isSubselector,
      isHeader,
      convertHeader,
      toKebabCase,
      removeDoubleQuotes,
      convertCommas,
      addMissingSemicolon,
      addFinalBacktick
    } = cssConversion

    const { cssInput }  = this.state
    let   lines         = []
    let   bracketsFound = 0
    const hasOpeningBracket = str => str.includes('{') && (bracketsFound++)
    const hasClosingBracket = str => str.includes('}') && (bracketsFound--)
    
    await this.pasteClipboard()
    lines = cssInput.split('\n')

    lines = lines.map(line => {
      
      // stores the line's indents, then removes them
      const lineIndents = storeIndents(line)
      line = line.trim()

      // splits the lines based off of whether it's a subselector or not
      const isSubSelector = isSubselector(line)
      line = line.split(isSubSelector ? '":' : ':')

      if (isKeyValuePair(line)) {

        let key = line[0]
        let val = line[1]

        const convertKeyValue = () => {

          if (key) {
            key = removeDoubleQuotes(key)
            key = toKebabCase(key)
          }

          if (val) {
            val = val.trim()
            val = removeDoubleQuotes(val)
            val = convertCommas(val)
                  hasOpeningBracket(val)
            val = addMissingSemicolon(val)
          }

          line = [key, val]

        }

        isHeader(val) ? (line = convertHeader(key)) : convertKeyValue()

      } else {

        hasOpeningBracket(line[0])
        !bracketsFound && (line[0] = addFinalBacktick(line[0]))
        hasClosingBracket(line[0])

      }

      line = line.join(': ')
      line = `${lineIndents}${line}`

      return line
      
    })

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