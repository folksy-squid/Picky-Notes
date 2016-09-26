const Link = ReactRouter.Link;

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.socket = null;
  }

  componentWillMount() {
    this.socket = io();
  }

  componentDidMount() {
    this.socket.disconnect();
  }

  render() {
    return (
      <div>
        <div className="lectureTitle">
          <span>*Lecture Title* </span>
          <span>By *Lecturers Name*</span>
        </div>
      </div>
    );
  }
}