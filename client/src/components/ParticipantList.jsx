export default ({participants}) => (
  <div className="participants">
    {participants.map(({name}, i)=>
      <div key={i}>
        <i className="fa fa-user" aria-hidden="true"></i><span>{name}</span>
      </div>
    )}
  </div>
);