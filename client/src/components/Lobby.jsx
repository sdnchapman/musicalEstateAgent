import React from 'react'; 

const Lobby = ({isVip}) => {
  return (
    <div className="lobby-container">
      <h1>Lobby</h1>
      {isVip? <Vip/> : <Client/> }
    </div>
  );
};

const Vip = () =>{
  return(
    <div className="vip-container">
      You are a VIP
      <Button content="Start"/>
    </div>
  )
}

const Button = ({content}) =>{
  return(
    <button>{content}</button>
  )
}

const Client = () =>{
  return(
    <div>
      Waiting for all players to join...
    </div>
  )
}

export default Lobby;