import React from 'react';

import Square from './Square';

import * as utils from '../utils';

function renderSquare(cordinates, squareClasses, onClick) {
  return (
    <Square
      key={cordinates}
      cordinates={cordinates}
      squareClasses={squareClasses}
      onClick={onClick} />
  )
}

export default function Board(props) {
  let boardRender = [];
  let columnRender = [];

  const moves = props.moves;
  const activePiece = props.activePiece;
  const currentPlayer = props.currentPlayer;

  for(let coordinates in props.boardState) {
    if(!props.boardState.hasOwnProperty(coordinates)) {
      continue;
    }

    const col = utils.getColAsInt(props.columns, coordinates);
    const row = utils.getRowAsInt(coordinates);

    const colorClass = ( (utils.isOdd(col) && utils.isOdd(row)) || (!utils.isOdd(col) && !(utils.isOdd(row)) ) ) ?  'black' : 'white';
    const squareClass = [];

    squareClass.push(colorClass);
    squareClass.push(coordinates);

    if(activePiece === coordinates) {
      squareClass.push('isActive');
    }

    if(moves.indexOf(coordinates) > -1) {
      let moveClass = 'movable ' + currentPlayer + '-move';
      squareClass.push(moveClass);
    }

    if (props.boardState[coordinates] !== null) {
      squareClass.push(props.boardState[coordinates].player + ' piece');

      if(props.boardState[coordinates].isKing === true) {
        squareClass.push('king');
      }
    }

    const squareClasses = squareClass.join(' ');

    columnRender.push(renderSquare(coordinates, squareClasses, props.onClick));

    if (columnRender.length >= 8) {
      // columnRender = columnRender.reverse();
      boardRender.push(<div key={boardRender.length} className="board-row">{columnRender}</div>);
      columnRender = [];
    }
  }

  return (
    <div className="Board">
      { boardRender }
    </div>
  );
}