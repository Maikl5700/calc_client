import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateComputes } from 'actions/computes';
import 'styles.css';

// COMPONENTS
import Computes from 'components/Computes'


const client = new WebSocket('ws://35.157.232.47:80/')

class App extends Component {

  state = {
    arg1: "",
    arg2: "",
    action: 0,
    result: null,
    resultError: false,
    pending: false
  }

  componentWillMount() {
    client.onopen = (e) => {
      console.log('connected');
    };

    client.onmessage = (message) => {
      const resData = JSON.parse(message.data)
      //console.log(resData)
      switch (resData.type) {
        case 'result': {
          const { update } = this.props
          update(resData.data.computes)

          console.log(resData)

          const statesToChange = {
            computes: resData.data.computes,
            pending: false
          }

          // CONDITIONALY ADD RESULT PROPERTY
          if (resData.data.result) {
            statesToChange.result = resData.data.result
          }

          // CONDITIONALY ADD RESULT ERROR PROPERTY
          if (typeof resData.data.result != 'undefined') {
            if (resData.data.result === 'Ошибка') {
              statesToChange.result = resData.data.result
              statesToChange.resultError = true
            } else {
              statesToChange.result = resData.data.result
              statesToChange.resultError = false
            }
          }

          this.setState(statesToChange)
        } break;

        default:
          break;
      }
    };
  }

  handleAction = event => {
    this.setState({
      action: event.target.selectedIndex
    })
  }

  inputValid = event => {
    // ONLY DIGITS 0-8 length
    if (/^[0-9]{0,8}$/.test(event.target.value)) {
      this.setState({ [event.target.name]: event.target.value })
    } else {
      event.target.value = this.state[event.target.name]
    }
  }

  requestApi = async event => {
    event.preventDefault()

    // ALL INPUTS
    const { arg1, arg2, action } = this.state

    if (arg1 && arg2) {
      const formData = JSON.stringify({
        type: 'form_data',
        data: {
          arg1,
          arg2,
          action
        }
      })

      try {
        await client.send(formData)
        this.setState({
          pending: true
        })
      } catch (error) {
        console.log(error)
      }
    }
  }


  render() {
    const { pending, resultError, result } = this.state

    return (
      <div className="container">
        <h1>Калькулятор</h1>
        <form id="form" onSubmit={this.requestApi}>
          <input disabled={pending} required onChange={this.inputValid} type="text" id="arg1" name="arg1" />
          <select onChange={this.handleAction} disabled={pending} name="action" id="action">
            <option value="1">+</option>
            <option value="2">-</option>
            <option value="3">X</option>
            <option value="4">/</option>
          </select>
          <input disabled={pending} required onChange={this.inputValid} type="text" id="arg2" name="arg2" />
          <button disabled={pending}>
            <span style={{ display: pending ? 'none' : 'inline' }}>=</span>
            <div style={{ display: pending ? 'block' : 'none' }} className="lds-ring"><div></div><div></div><div></div><div></div></div>
          </button>
          <span id="result" className={resultError ? 'error' : ''}>{result}</span>
        </form>
        <Computes />
      </div>
    )
  };
}



const mapDispatchToProps = dispatch => ({
  update: (computes) => dispatch(updateComputes(computes))
})

export default connect(null, mapDispatchToProps)(App)
