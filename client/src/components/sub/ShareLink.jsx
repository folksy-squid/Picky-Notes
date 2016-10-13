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

  selectText() {
    this.refs.copyButton.click();
  }

  render () {
    return (
      <div className="clipboard">
        <input ref="shareLink" className="shareLink" value={`${window.location.host}/lobby/${this.props.pathUrl}`} onClick={this.selectText.bind(this)} readOnly/>
        <div className="buttonCell">
          <button ref="copyButton" className="copyButton" data-clipboard-target=".shareLink">
            <i className="ion ion-clipboard"></i>
          </button>
        </div>
      </div>
    );
  }
}
