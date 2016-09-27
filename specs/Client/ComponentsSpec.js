/* jshint esversion: 6 */
import React from 'react';
import {expect} from 'chai';
import { mount, shallow } from 'enzyme';

import Main from '../../client/src/components/Main';

describe('<Avatar/>', function () {
  it('should have an image to display the gravatar', function () {
    const wrapper = shallow(<Main/>);
    expect(wrapper.contains(<div/>)).to.equal(true);
  });

  it('should have props for email and src', function () {
    const wrapper = shallow(<Main/>);
    expect(wrapper.find(Navbar)).to.have.length(1);
  });
});
