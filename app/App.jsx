var style = require("./app.less");

import React  from 'react'
import Header from './Header.jsx'
import Poke from './Poke.jsx'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.state = { searchKey: '' }
  }
  onSearch(searchKey) {
    this.setState({ searchKey })
  }
  render() {
    return (
      <div className="poke">
        <Header onSearch={this.onSearch} />
        <Poke searchKey={this.state.searchKey} />
      </div>
    );
  }
}
