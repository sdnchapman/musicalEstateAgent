import React from 'react';

const reviews = [
  "No matter where you go, MusicEstate is the coolest, most happening thing around!",
  "I love your system. After using MusicEstate my business skyrocketed!",
  "We've used MusicEstate for the last five years. MusicEstate impressed me on multiple levels. We're loving it. Thank You!",
  "I love your system. We've seen amazing results already. Thanks to MusicEstate, we've just launched our 5th website!",
  "MusicEstate is the real deal! I like MusicEstate more and more each day because it makes my life a lot easier. Great job, I will definitely be ordering again!",
  " I couldn't have asked for more than this. Thank you for making it painless, pleasant and most of all hassle free! MusicEstate is the next killer app.",
  "We're loving it. It's really wonderful. Wow what great service, I love it! Just what I was looking for."
];

const getRandomReview = () => {
  return reviews[Math.floor(Math.random() * reviews.length)];
};

const Reviews = () => (
  <div className="row shadow-lg p-4 mt-4 bg-secondary text-light">
    <div className="col-6 col-md-3">
      <h3>Reviews*</h3>
      <span>(* May not directly apply to our product or service)</span>
    </div>
    <div className="col-6 col-md-9">
      <div className="speech-bubble">{getRandomReview()}</div>
    </div>
  </div>
);

export default Reviews;