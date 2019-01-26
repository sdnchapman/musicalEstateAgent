import React from 'react';

const ScoreBall = ({className, teamScore, highestScore}) => (
  <div className={"score-circle pulse " + className} style={
    {
      height: `${teamScore / highestScore * 100 + 60}px`,
      width: `${teamScore / highestScore * 100 + 60}px`,
      'animation-duration': `${(Math.random() * 1000) + 1200}ms`,
  }
  }>
    {teamScore.toString()}
  </div>
);

export default ScoreBall;