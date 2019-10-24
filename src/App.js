import React, { Component } from 'react'
import './App.css';

import outputEffects from './helpers/app/outputEffects'

import upperCaseName from './helpers/component/upperCaseName'
import toKebabCase from './helpers/key/toKebabCase'

import lastCharacters from './helpers/value/lastCharacters'
import removeDoubleQuotes from './helpers/value/removeDoubleQuotes'
import convertCommas from './helpers/value/convertCommas'

class App extends Component {

  state = {
    cssInput  : `  dropdown: css({
      background: "white",
      padding: "40px",
      borderRadius: "3px",
      boxShadow: "0 0 20px rgba(0,0,0,0.1)",
      minWidth: "200px",
      "& ul, li, a, p": {
        marginRight: "0 !important",
        padding: "0 !important"
      },
      "& ul p": {
        marginBottom: "12px"
      },
      "& li:last-of-type p": {
        marginBottom: "0px"
      },
      "& li:hover p": {
        opacity: "0.5"
      },
      "& img": {
        maxWidth: "50px",
        borderRadius: "50%",
        marginRight: "20px",
        display: "inline-block"
      },
      ...responsive("tablet", {
        display: "none"
      })
    }),`,
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
      
      let lineIndents
      line ? (lineIndents =  ' '.repeat(line.search(/\S/))) : (lineIndents = '')

      line = line.trim()
      line = line.split(':')

      if (line.length === 2) {

          let key = line[0]
          let val = line[1]
          let isHeader = false

          const { lastTwoChars } = lastCharacters(val.split(''))
          lastTwoChars === '({' && (isHeader = true)

          if (isHeader) {

            line = [`${upperCaseName(key)} = styled.div\``]

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