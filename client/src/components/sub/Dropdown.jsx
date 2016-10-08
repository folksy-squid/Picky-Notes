import React from 'react';

export default class Dropdown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedValue: 'All'
    };
  }

  componentDidMount() {
    this.renderListItems();
  }

  select (e) {
    this.setState({ selectedValue: e.target.value });
    this.props.filterClass(e.target.value);
  }

  renderListItems () {
    var allClasses = [<option key={-1}>All</option>];
    for (let i = 0; i < this.props.list.length; i++) {
      allClasses.push(
        <option key={i}>{this.props.list[i]}</option>
      );
    }
    return allClasses;
  }

  render () {
    return (
      <div>
        <select value={this.state.selected} onChange={this.select.bind(this)}>
          {this.renderListItems()}
        </select>
      </div>
    );
  }
}
