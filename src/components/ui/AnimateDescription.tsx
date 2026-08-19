'use client';

import React from 'react';
import ScrollWordReveal from './ScrollWordReveal';

interface AnimateDescriptionProps {
  text: string;
  className?: string;
  dimOpacity?: number;
  offset?: [string, string];
}

const AnimateDescription: React.FC<AnimateDescriptionProps> = ({
  text,
  className = '',
  dimOpacity = 0.22,
  offset = ['start 0.95', 'end 0.65'],
}) => {
  return (
    <ScrollWordReveal
      text={text}
      className={className}
      dimOpacity={dimOpacity}
      offset={offset}
    />
  );
};

export default AnimateDescription;
