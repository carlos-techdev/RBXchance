import React from 'react';

const Emoji = ({ src, alt, title }) => {
  return <img style={{ width: "30px", }} src={src} alt={alt} title={title} />;
};

export default Emoji;