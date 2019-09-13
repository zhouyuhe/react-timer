import React, { useReducer, useEffect } from 'react';
import './App.css';

const pad = time => time < 10 ? `0${time}` : time

const millisecondConversion = (timeElapsed) => {
  const milliseconds = timeElapsed % 100;
  const seconds = Math.floor((timeElapsed / 100) % 60)
  const minutes = Math.floor((timeElapsed / (60 * 100)) % 60)
  return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`
}

const START_STOP = 'START_STOP';
const INCREMENT_TIMER = 'INCREMENT_TIMER';
const LAP_RESET = 'LAP_RESET'

const initialState = { isRunning: false, timeElapsed: 0, previousTime: 0, lapTimes: [] }

const reducer = (state, action) => {
  switch (action) {
    case START_STOP:
      return { ...state, isRunning: !state.isRunning }
    case INCREMENT_TIMER:
      return { ...state, timeElapsed: state.timeElapsed + 1 }
    case LAP_RESET:
      if (!state.isRunning) {
        return { isRunning: false, timeElapsed: 0, previousTime: 0, lapTimes: [] }
      } else {
        return {
          ...state,
          previousTime: state.timeElapsed,
          lapTimes: [state.timeElapsed - state.previousTime, ...state.lapTimes]
        }
      }
    default:
      return state
  }
}

let interval;

const renderRow = (lap, time, index) =>
  <tr key={index}>
    <td>Lap {lap}</td>
    <td>{time}</td>
  </tr>

const App = () => {

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state.isRunning) {
      interval = setInterval(() =>
        dispatch(INCREMENT_TIMER)
        , 10)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval()

  }, [state.isRunning])

  const { isRunning, timeElapsed, previousTime, lapTimes } = state

  const startStopLbl = isRunning ? 'Stop' : 'Start'
  const lapResetlbl = isRunning || timeElapsed === 0 ? 'Lap' : 'Reset'

  return (
    <div className="container">
      <h1 className="time">{millisecondConversion(timeElapsed)}</h1>
      <div className="button__wrapper">
        <button className='button__item' onClick={() => dispatch(LAP_RESET)}>{lapResetlbl}</button>
        <button className='button__item' onClick={() => dispatch(START_STOP)}>{startStopLbl}</button>
      </div>
      <table className="timer__table">
        <tbody>
          {renderRow(lapTimes.length + 1, millisecondConversion(timeElapsed - previousTime))}
          {lapTimes.map(
              (lap, index) => renderRow(lapTimes.length - index, millisecondConversion(lap), index)
            )}
        </tbody>
      </table>
    </div>
  );
}

export default App;