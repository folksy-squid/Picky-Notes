export default ({participants}) => (
  <div className="participants">
    {participants.map(({name}, i)=>
      <div key={i}>
        <i className="ion ion-android-person" aria-hidden="true"></i>
        <span>{name}</span>
      </div>
    )}
  </div>
);