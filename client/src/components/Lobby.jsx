import { Link } from 'react-router';
import ParticipantList from './ParticipantList.jsx';

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
        <ParticipantList participants={[{name: 'Kunal'}, {name: 'Marco'}, {name: 'Derek'}, {name: 'Sean'}]}/>
      </div>
    );
  }
}