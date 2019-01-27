import React from 'react';

const motivations = [
  "If you can stay calm, while all around you is chaos … then you probably haven’t completely understood the seriousness of the situation",
  "TEAMWORK … means never having to take all the blame yourself.",
  "Before you criticise someone walk 100 miles in their shoes, then when you do you will be 100 miles away and have their shoes!",
  "Helping colleagues is a great way to distract from your own mistakes",
  "Making a simple problem sound complicated is a great way to make yourself look better at your job.",
  "It's only a bug if the customer notices it",
  "Dont be afraid to ask for help, Be afraid of the answers you might get",
  "Learning from a mistake is extremely valuable.. Unless that mistak gets you fired",
  "If you have to ask if something is suitable for work then it probably isn't...",
  "Always follow your instincts, even if it goes against project specs",
  "If your manager says it, its probably wrong, but do it anyway",
  "Always remember you are just another resource",
  "Teambuilds ARE NOT just an excuse to get drunk on company time",
  'Remember! Team building activities are not just essential, they are fun 👍',
]

const bgColours = [
  "bg-primary",
  "bg-secondary",
  "bg-success",
  "bg-danger",
  "bg-info",
  "bg-dark",
];

const getRandomMotivation = () => {
  return motivations[Math.floor(Math.random() * motivations.length)];
};

const getRandomBgColour = () => {
  return bgColours[Math.floor(Math.random() * bgColours.length)];
};

const Motivation = () => (
  <div className="container">
    <div className={`row shadow-lg p-4 mt-4 text-light ${getRandomBgColour()}`}>
      <div className="col-12">
        <h3>{getRandomMotivation()}</h3>
      </div>
    </div>
  </div>
);

export default Motivation;