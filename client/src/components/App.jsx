import React from 'react';
import { Link } from 'react-router';
import Joyride from 'react-joyride';
import Connection from '../Connection.js';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      joyrideOverlay: true,
      joyrideType: 'continuous',
      ready: false,
      steps: []
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        ready: true
      });
    }, 400);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.ready && this.state.ready) {
      this.joyride.start();
    }
  }

  addSteps(newSteps) {
    const joyride = this.joyride;

    if (!Array.isArray(steps)) {
      newSteps = [newSteps];
    }

    if (!newSteps.length) {
      return false;
    }

    this.setState(function(currentState) {
      currentState.steps = currentState.steps.concat(joyride.parseSteps(newSteps));
      return currentState;
    });
  }

  addTooltip(data) {
    this.joyride.addTooltip(data);
  }

  callback(data) {
    // console.log('%ccallback', 'color: #47AAAC; font-weight: bold; font-size: 13px;');
    // console.log(data);
  }

  onClickSwitch(e) {
    e.preventDefault();
    const el = e.currentTarget;
    const state = {};

    if (el.dataset.key === 'joyrideType') {
      this.joyride.reset();

      setTimeout(() => {
        this.joyride.start();
      }, 300);

      state.joyrideType = e.currentTarget.dataset.type;
    }

    if (el.dataset.key === 'joyrideOverlay') {
      state.joyrideOverlay = el.dataset.type === 'active';
    }

    this.setState(state);
  }


  render() {
    const state = this.state;

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        onClickSwitch: this.onClickSwitch,
        addSteps: this.addSteps,
        addToolTip: this.addTooltip,
        joyrideType: state.joyrideType,
        joyrideOverlay: state.joyrideOverlay
      })
    );

    let html;

    if (this.state.ready) {
      html = (
        <div>
          <Joyride
            ref={c => (this.joyride = c)}
            debug={true}
            steps={state.steps}
            type={state.joyrideType}
            locale={{
              back: (<span>Back</span>),
              close: (<span>Close</span>),
              last: (<span>Last</span>),
              next: (<span>Next</span>),
              skip: (<span>Skip</span>)
            }}
            showSkipButton={true}
            showStepsProgress={true}
            showOverlay={state.joyrideOverlay}
            callback={this.callback} />
          {childrenWithProps}
        </div>
      )
    }
    else {
      html = <div>loading</div>;
    }

    return html;
  }
}

export default App;
