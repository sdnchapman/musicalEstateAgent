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
    <div>
      <p>{content}</p>
    </div>
  )
}

const Client = () =>{
  return(
    <div>
      Waiting for all players...
    </div>
  )
}

export default Lobby;