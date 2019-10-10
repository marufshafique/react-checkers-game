import React from 'react';

export default function Square(props) {
  return (
    <button className = { "square " + props.squareClasses } onClick={() => props.onClick(props.cordinates)} >
      <div><div></div></div>
    </button>
  )
}