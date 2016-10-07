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
  }

  renderListItems () {
    var items = [<option>All</option>];
    for (let i = 0; i < this.props.list.length; i++) {
      items.push(
        <option>{this.props.list[i]}</option>
      );
    }
    return items;
  }

  render () {
    var message = `You selected ${this.state.selectedValue}`;
    return (<div>
      <select value={this.state.selected} onChange={this.select.bind(this)}>{this.renderListItems()}</select>
      <p> {message} </p>
      </div>
    );
  }
}
