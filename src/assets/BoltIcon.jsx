import React from 'react';

const BoltIcon = ({ fill = "currentColor", className, style, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    fill={fill}
    className={className}
    style={{ color: 'var(--card-icon-fill)', ...style }}
    {...props}
  >
    <path d="M296 160h-115.3L233 33.7c4.2-8.3 2.7-18.2-3.8-25s-16.3-8.4-25-4.2l-208 112C-9.6 122.2-12 131.9-8.1 140.2S4 160 13.3 160H128l-80 272c-3.1 10.5 1.2 21.7 10.5 27.2S72 464 80 456l208-224c7-7.5 9.1-18.3 5.5-28s-12.4-16-21.5-16z"/>
  </svg>
);

export default BoltIcon;