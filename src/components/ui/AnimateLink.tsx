import React from 'react';
import Magnetic from '@/components/ui/Magnetic';

interface AnimatedLinkProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<any>) => void;
  className?: string;
  magnetic?: boolean;
  strength?: number;
  as?: React.ElementType;
}

const AnimatedLink: React.FC<AnimatedLinkProps> = ({
  children,
  onClick,
  className = '',
  magnetic = true,
  strength = 0.38,
  as: Wrapper = 'li',
}) => {
  if (React.isValidElement(children) && children.type === 'a') {
    const { href, children: text, onClick: childOnClick, target, rel, className: childClassName, ...rest } = children.props as any;

    const linkContent = (
      <a
        href={href}
        onClick={childOnClick || onClick}
        target={target}
        rel={rel}
        className={`${childClassName || ''} relative z-10 overflow-hidden h-[1.25em] group cursor-pointer inline-flex items-center`.trim()}
        {...rest}
      >
        <span
          className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full group-focus-visible:-translate-y-full h-full flex items-center"
        >
          {text}
        </span>
        <span
          aria-hidden="true"
          className="block absolute top-full left-0 transition-transform duration-300 ease-in-out group-hover:-translate-y-full group-focus-visible:-translate-y-full pointer-events-none h-full flex items-center"
        >
          {text}
        </span>
      </a>
    );

    return (
      <Wrapper className={`${className} ${Wrapper === 'li' ? 'list-none' : ''}`.trim()}>
        {magnetic ? (
          <Magnetic strength={strength}>
            {linkContent}
          </Magnetic>
        ) : (
          linkContent
        )}
      </Wrapper>
    );
  }

  const spanContent = (
    <span
      className="relative z-10 overflow-hidden h-[1.25em] group cursor-pointer inline-flex items-center"
      onClick={onClick}
    >
      <span
        className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full group-focus-visible:-translate-y-full h-full flex items-center"
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="block absolute top-full left-0 transition-transform duration-300 ease-in-out group-hover:-translate-y-full group-focus-visible:-translate-y-full pointer-events-none h-full flex items-center"
      >
        {children}
      </span>
    </span>
  );

  return (
    <Wrapper className={`${className} ${Wrapper === 'li' ? 'list-none' : ''}`.trim()}>
      {magnetic ? (
        <Magnetic strength={strength}>
          {spanContent}
        </Magnetic>
      ) : (
        spanContent
      )}
    </Wrapper>
  );
};

export default AnimatedLink;
