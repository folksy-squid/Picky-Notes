import React from 'react';
import { mount, shallow, render } from 'enzyme';
import {Provider} from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import {expect, assert} from 'chai';
import sinon from 'sinon';
import Navbar from '../../client/src/components/Navbar';
import App from '../../client/src/components/App';
import Main from '../../client/src/components/Main';
import {createStore} from 'redux';
const mockReducer = function(state = {notes: null}, action) {
  return state;
};
const store = createStore(mockReducer);

describe('<App />', () => {
  it('should have a navbar inside', () => {
    var spy = sinon.spy(App.prototype, 'componentDidMount');
    const wrapper = mount(<App store={store}/>);
    assert.isTrue(App.prototype.componentDidMount.calledOnce);
    expect(wrapper.find(Navbar).length).to.equal(1);
    App.prototype.componentDidMount.restore();
  });
});

describe('<Main />', () => {
  it('should have a single child', () => {
    const wrapper = render(<Main store={store}/>);
    expect(wrapper.children().length).to.equal(1);
    // expect(wrapper.children).to.equal(true);
  });
});

describe('<Navbar />', () => {
  const wrapper = render(<Navbar/>);
  it('should have a Navbar', () => {
    expect(wrapper.find(<nav/>)).to.exist;
  });
  it('should have Navbar links', () => {
    expect(wrapper.find('.nav').length).to.equal(2);
    expect(wrapper.find('.nav-item').length).to.equal(4);
    expect(wrapper.find('.nav-link').length).to.equal(4);
  });
});
