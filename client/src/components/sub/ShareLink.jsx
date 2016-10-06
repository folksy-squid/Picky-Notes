import React from 'react';

export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    new Clipboard(this.refs.copyButton, {
      text: (trigger) => {
        return this.refs.shareLink.innerText;
      }
    });
  }

  render () {
    return (
      <div className="clipboard">
        <input ref="shareLink" className="shareLink" value={`localhost:3000/lobby/${this.props.pathUrl}`} readOnly/>
        <div className="buttonCell">
          <button ref="copyButton" className="copyButton" data-clipboard-target=".shareLink">
            <i className="ion ion-clipboard"></i>
          </button>
        </div>
      </div>
    );
  }
}
