import React from 'react';

const AnimatedLink = ({ children, onClick, className = "" }) => (
  <li className={`${className}`}>
    <span
      className="relative overflow-hidden h-6 group cursor-pointer inline-block"
      onClick={onClick}>
      <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
        {children}
      </span>
      <span className="block absolute top-full left-0 transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
        {children}
      </span>
    </span>
  </li>
);

export default AnimatedLink;