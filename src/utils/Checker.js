import * as utils from './index';

export  class Checker {
  constructor(columns) {
    this.columns = columns;
  }

  getCorners = (coordinates) => {
    const row = utils.getColAsInt(this.columns, coordinates);
    const col = utils.getRowAsInt(coordinates);

    const rowUpper = row -1 >= 0 ? utils.getRowAsAlph(this.columns, row - 1) : false;
    const rowLower = row +1 <= 8 ? utils.getRowAsAlph(this.columns, row + 1) : false;

    const columnLeft = col -1 >= 0 ? col -1 : false;
    const columnRight = col +1 <= 8 ? col +1 : false;

    let corners = {};

    corners.leftUpper = rowUpper !== false && columnLeft !== false ? rowUpper + columnLeft : null;
    corners.rightUpper = rowUpper !== false && columnRight !== false ? rowUpper + columnRight : null;
    corners.leftLower = rowLower !== false && columnLeft !== false ? rowLower + columnLeft : null;
    corners.rightLower = rowLower !== false && columnRight !== false ? rowLower + columnRight : null;

    return corners;
  }

  getMoves = (boardState, coordinates, isKing = false, hasJump = false) => {
    console.log(boardState, coordinates, boardState[coordinates]);
    if(boardState[coordinates] === null) {
      return;
    }

    let moves = [];
    let jumps = [];

    let jumpKill = {};

    let corners = this.getCorners(coordinates);

    const player = boardState[coordinates].player;
    let rowInt = utils.getColAsInt(this.columns, coordinates);
    rowInt = player === 'player1' ? rowInt -1 : rowInt +1;

    const allowedRow = utils.getRowAsAlph(this.columns, rowInt);

    for(let key in corners) {
      if(!corners.hasOwnProperty(key)) {
        continue;
      }

      let cornerCordinate = corners[key];
      if(cornerCordinate === null) {
        continue;
      }

      if(!isKing && cornerCordinate.indexOf(allowedRow) < 0) {
        continue;
      }

      if(boardState[cornerCordinate] == null) {
        moves.push(cornerCordinate);
      } else {
        let opponentPlayer = boardState[cornerCordinate].player;
        
        if(opponentPlayer === player) {
          continue;
        }

        let opponentCorners = this.getCorners(cornerCordinate);
        let potencialJump = opponentCorners[key];

        if(boardState[potencialJump] === null) {
          jumpKill[cornerCordinate] = potencialJump;
          jumps.push(potencialJump);
        }
      }
    }

    let movesOut;

    if(hasJump === false) {
      movesOut = moves.concat(jumps);
    } else {
      movesOut = jumps;
    }

    let killJumpOut = jumps.length > 0 ? jumpKill : null;
    
    return [movesOut, killJumpOut];
  }

  movePiece = (coordinates, state) => {
    let boardState = Object.assign({}, state.boardState);
    const movingPeice = Object.assign({}, state.boardState[state.activePiece]);
    const activePiece = state.activePiece;

    let jumps = [];

    for(let key in state.jumpKills) {
      if (!state.jumpKills.hasOwnProperty(key)) {
        continue;
      }

      jumps.push(state.jumpKills[key]);
    }

    if(state.moves.indexOf(coordinates) < 0 && jumps.indexOf(coordinates) < 0) {
      return null;
    }

    // Check king
    if(this.shouldKing(movingPeice, coordinates)) {
      movingPeice.isKing = true;
    }

    boardState[activePiece] = null;
    boardState[coordinates] = movingPeice;

    let setCurrentPlayer = state.currentPlayer === 'player1' ? 'player2' : 'player1';
    let newMoves = [];
    let hasJump = null;
    let setActivePiece = null;

    let stateOut = {};

    if(jumps.indexOf(coordinates) > -1) {
      let opponentPosition = utils.getKeyByValue(state.jumpKills, coordinates);
      boardState[opponentPosition] = null;

      newMoves = this.getMoves(boardState, coordinates, movingPeice.isKing, true);
      
      if(newMoves[0].length > 0) {
        hasJump = true;
        setActivePiece = coordinates;
        setCurrentPlayer = state.currentPlayer;
      }
    }

    stateOut.boardState = boardState;
    stateOut.currentPlayer = setCurrentPlayer;
    stateOut.moves = hasJump === true ? newMoves[0] : [];
    stateOut.jumpKills = hasJump === true ? newMoves[1] : null;
    stateOut.hasJumped = hasJump === true ? movingPeice.player : null;
    stateOut.activePiece = setActivePiece;
    stateOut.winner = this.evaluateWinner(boardState);

    return stateOut;
  }

  shouldKing(movingPiece, coordinates) {
    if (movingPiece.isKing === true) {
      return false;
    }

    const rowInt = utils.getColAsInt(this.columns, coordinates);
    const row = utils.getRowAsAlph(this.columns, rowInt);
    const player = movingPiece.player;

    return ( (row === 'a' && player === 'player1') || (row === 'h' && player === 'player2') );
  }

  evaluateWinner(boardState) {

    let player1Pieces = 0;
    let player1Moves  = 0;

    let player2Pieces = 0;
    let player2Moves  = 0;

    for (let coordinates in boardState) {
      if (!boardState.hasOwnProperty(coordinates) || boardState[coordinates] === null) {
        continue;
      }

      const movesData = this.getMoves(boardState, coordinates, boardState[coordinates].isKing, false);
      const moveCount = movesData[0].length;

      if (boardState[coordinates].player === 'player1') {
        ++player1Pieces;
        player1Moves += moveCount;

      } else {
        ++player2Pieces;
        player2Moves += moveCount;
      }
    }

    if (player1Pieces === 0 ) {
      return 'player2';
    }

    if (player2Pieces === 0 ) {
      return 'player1';
    }

    if (player1Moves === 0) {
      return 'player2';
    }

    if (player2Moves === 0) {
      return 'player1';
    }

    return null;
  }
}