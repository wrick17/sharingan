var style = require("./header.less");

import React  from 'react'
import classNames from 'classnames'

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.showSearch = this.showSearch.bind(this);
    this.hideSearch = this.hideSearch.bind(this);
    this.setSearchKey = this.setSearchKey.bind(this);
    this.state = {
      showSearch: false,
      searchKey: ''
    }
  }
  showSearch() {
    if (this.state.showSearch) return this.hideSearch();
    this.refs.search.focus();
    this.setState({
      showSearch: true
    })
  }
  hideSearch() {
    this.setState({
      showSearch: false,
      searchKey: ''
    }),
    this.props.onSearch && this.props.onSearch('');
  }
  setSearchKey(e) {
    const searchKey = e.target.value.toLowerCase();
    this.setState({
      searchKey: searchKey
    })
    this.props.onSearch && this.props.onSearch(searchKey);
  }
  render() {
    const {showSearch, searchKey} = this.state;
    return (
      <header className="header">
        {/*<div className="animation-box">
          <img src="images/icon-192x192.png" className="animation-image" />
        </div>*/}
        <div className="wrapper">
          <span className="logo">Pokemons</span>
          <div className={classNames("search", {"show": showSearch})}>
            <input className="search-box" value={searchKey} onChange={this.setSearchKey} ref="search" />
            <span className="search-icon" onClick={this.showSearch} >⚲</span>
          </div>
        </div>
      </header>
    )
  }
}
