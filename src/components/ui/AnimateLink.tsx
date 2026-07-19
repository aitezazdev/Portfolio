import React from 'react';

interface AnimatedLinkProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<any>) => void;
  className?: string;
}

const AnimatedLink: React.FC<AnimatedLinkProps> = ({ children, onClick, className = '' }) => {
  if (React.isValidElement(children) && children.type === 'a') {
    const { href, children: text, onClick: childOnClick, target, rel, className: childClassName, ...rest } = children.props as any;

    return (
      <li className={`${className} list-none`}>
        <a
          href={href}
          onClick={childOnClick || onClick}
          target={target}
          rel={rel}
          className={`${childClassName || ''} relative z-10 overflow-hidden h-6 group cursor-pointer inline-flex items-center`.trim()}
          style={{ display: 'inline-flex', alignItems: 'center' }}
          {...rest}
        >
          <span
            className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full"
            style={{ height: '100%', display: 'flex', alignItems: 'center' }}
          >
            {text}
          </span>
          <span
            aria-hidden="true"
            className="block absolute top-full left-0 transition-transform duration-500 ease-in-out group-hover:-translate-y-full pointer-events-none"
            style={{ height: '100%', display: 'flex', alignItems: 'center' }}
          >
            {text}
          </span>
        </a>
      </li>
    );
  }

  return (
    <li className={`${className} list-none`}>
      <span
        className="relative z-10 overflow-hidden h-6 group cursor-pointer inline-flex items-center"
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
          aria-hidden="true"
          className="block absolute top-full left-0 transition-transform duration-500 ease-in-out group-hover:-translate-y-full pointer-events-none"
          style={{ height: '100%', display: 'flex', alignItems: 'center' }}
        >
          {children}
        </span>
      </span>
    </li>
  );
};

export default AnimatedLink;
