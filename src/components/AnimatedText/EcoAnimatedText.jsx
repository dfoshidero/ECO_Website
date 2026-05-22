import React, { useMemo } from "react";
import { TypeAnimation } from "react-type-animation";
import "./EcoAnimatedText.scss";

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const EcoAnimatedText = ({ examples }) => {
  const sequence = useMemo(() => {
    const shuffled = shuffle(examples);
    return shuffled.flatMap((text) => [800, text, 4000, "", 600]);
  }, [examples]);

  return (
    <div className="eco-animated-text" aria-hidden="true">
      <TypeAnimation
        cursor
        sequence={sequence}
        wrapper="span"
        repeat={Infinity}
        speed={55}
        deletionSpeed={60}
      />
    </div>
  );
};

export default EcoAnimatedText;
