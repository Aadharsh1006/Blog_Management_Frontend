import React from 'react';
import { TypeAnimation } from 'react-type-animation';

const AnimatedHeaderText = ({ title, subtitleSequence }) => {
  return (
    <>
      <h1 className="display-4 fw-bold">{title}</h1>
      <TypeAnimation
        sequence={subtitleSequence}
        wrapper="p"
        speed={50}
        className="lead"
        repeat={Infinity}
      />
    </>
  );
};

export default AnimatedHeaderText;