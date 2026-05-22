import React from "react";
import { TypeAnimation } from "react-type-animation";
import "./AnimatedText.scss";

const AnimatedText = ({ examples }) => {
  const sequence = examples.flatMap(({ text }) => [
    1200,
    text,
    4000,
    "",
    800,
  ]);

  return (
    <div className="animated-text">
      <TypeAnimation
        cursor
        sequence={sequence}
        wrapper="span"
        repeat={Infinity}
        speed={45}
        deletionSpeed={55}
        className="animated-text__content"
      />
    </div>
  );
};

export default AnimatedText;
