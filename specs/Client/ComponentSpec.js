import React from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import mockedSocket from 'socket-io-mock';


import { mount, shallow, render } from 'enzyme';
import {expect, assert} from 'chai';
import sinon from 'sinon';
// import store from '../../client/src/store.js';

import {Navbar} from '../../client/src/components/Navbar.jsx';
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap';
import {Navbar as Navigation, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Modal, Button} from 'react-bootstrap';
import {Notebook} from '../../client/src/components/Notebook.jsx';
import SearchBar from '../../client/src/components/sub/SearchBar.jsx';
import EntryList from '../../client/src/components/sub/EntryList';
import {Lobby} from '../../client/src/components/Lobby';
import LectureTitle from '../../client/src/components/sub/LectureTitle.jsx';
import ShareLink from '../../client/src/components/sub/ShareLink.jsx';
import ChatBox from '../../client/src/components/sub/ChatBox.jsx';
import ParticipantList from '../../client/src/components/sub/ParticipantList.jsx';
const socket = new mockedSocket;

const profile = { id: '10206258612098067',
  username: undefined,
  displayName: undefined,
  name:
  { familyName: 'Rathi',
    givenName: 'Kunal',
    middleName: undefined
  },
  gender: 'male',
  profileUrl: undefined,
  emails: [ { value: 'volcanic.phoenix@gmail.com' } ],
  photos: [ { value: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/735019_3760102334957_1830986009_n.jpg?oh=013867e20b591f1d7e6aa994b5d6861c&oe=587E7900' } ],
  provider: 'facebook',
  _raw: '{"id":"10206258612098067","last_name":"Rathi","first_name":"Kunal","picture":{"data":{"is_silhouette":false,"url":"https:\\/\\/scontent.xx.fbcdn.net\\/v\\/t1.0-1\\/p200x200\\/735019_3760102334957_1830986009_n.jpg?oh=013867e20b591f1d7e6aa994b5d6861c&oe=587E7900"}},"email":"volcanic.phoenix\\u0040gmail.com","gender":"male"}',
  _json:
  { id: '10206258612098067',
    last_name: 'Rathi',
    first_name: 'Kunal',
    picture: { data: [Object] },
    email: 'volcanic.phoenix@gmail.com',
    gender: 'male'
  }
};
const information = [{
  id: 1,
  facebookId: profile.id,
  name: profile._json.first_name + ' ' + profile._json.last_name,
  email: profile.emails[0].value,
  pictureUrl: profile.photos[0].value,
  gender: profile.gender
}];
const roomInfo = {
  hostId: 1,
  topic: 'How to Leave HR47 Hanging',
  className: 'Hack Reactor',
  lecturer: 'Allen J. Price'
};

const fakeStore = {
  notes: null,
  user: {information},
  room: {
    roomInfo,
    socket,
    participants: [information[0]]
  }
};

const mockReducer = function(state = fakeStore, action) {
  return {...state};
};

const store = createStore(mockReducer);

describe('<Navbar />', () => {
  let wrapper = shallow(<Navbar />);
  it('should have a navigation element inside', () => {
    expect(wrapper.find(Navigation).length).to.equal(1);
  });
  it('should have a nav element inside', () => {
    expect(wrapper.find(Nav).length).to.equal(1);
  });
  it('should have an IndexLinkContainer element inside', () => {
    expect(wrapper.find(IndexLinkContainer).length).to.equal(1);
  });
  it('should have a LinkContainer element inside', () => {
    expect(wrapper.find(LinkContainer).length).to.equal(1);
  });
  it('should have a Modal element inside', () => {
    expect(wrapper.find(Modal).length).to.equal(1);
  });
});

describe('<Notebook />', () => {
  let wrapper = shallow(<Notebook user={fakeStore.user}/>);
  it('should not load initially', () => {
    expect(wrapper.state().loaded).to.equal(false);
    expect(wrapper.find(SearchBar).length).to.equal(0);
    expect(wrapper.find(EntryList).length).to.equal(0);
  });
  it('should load search bar and entry list', () => {
    wrapper.setState({loaded: true});
    expect(wrapper.find(SearchBar).length).to.equal(1);
    expect(wrapper.find(EntryList).length).to.equal(1);
  });
});

describe('<Lobby />', () => {
  let router = { push: sinon.stub() };
  const context = {router};
  let wrapper = shallow(<Lobby params={{roomId: 10000}} user={fakeStore.user} room = { fakeStore.room } />, { context });

  it('should load initially', () => {
    expect(wrapper.state().completed).to.equal(true);
    expect(wrapper.instance().props.params.roomId).to.equal(10000);
  });
  it('should load lecture title, chatbox, sharelink, and participants list', () => {
    expect(wrapper.find(LectureTitle).length).to.equal(1);
    expect(wrapper.find(ChatBox).length).to.equal(1);
    expect(wrapper.find(ShareLink).length).to.equal(1);
    expect(wrapper.find(ParticipantList).length).to.equal(1);
  });
});
