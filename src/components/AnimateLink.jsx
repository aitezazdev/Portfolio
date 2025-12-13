import React from 'react';

const AnimatedLink = ({ children, onClick, className = '' }) => (
  <li className={`${className} list-none`}>
    <span
      className="relative overflow-hidden h-6 group cursor-pointer inline-block"
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <span
        className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full"
        style={{ height: '100%', display: 'flex', alignItems: 'center' }}
      >
        {children}
      </span>

      <span
        className="block absolute top-full left-0 transition-transform duration-500 ease-in-out group-hover:-translate-y-full"
        style={{ height: '100%', display: 'flex', alignItems: 'center' }}
      >
        {children}
      </span>
    </span>
  </li>
);

export default AnimatedLink;
