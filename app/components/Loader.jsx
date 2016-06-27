require('./loader.less');

import React from 'react'

export default class Loader extends React.Component {
  render() {
    return (
      <div className="loader-container">
        <div className="loading">
          <label>Loading</label>
          <span className="one">.</span>
          <span className="two">.</span>
          <span className="three">.</span>
        </div>
      </div>
    )
  }
}
