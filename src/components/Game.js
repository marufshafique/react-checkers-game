import React, { Component } from 'react';
import { Checker } from '../utils/Checker';

import Board from './Board';

export class Game extends Component {
  constructor(props) {
    super(props);

    this.columns = this.setColumns();
    this.checker = new Checker(this.columns);

    this.state = {
      players: null,
      boardState: this.createBoard(),
      currentPlayer: 'player1',
      activePiece: null,
      moves: [],
      jumpKills: null,
      hasJumped: null,
      winner: null,
    }
  }

  setColumns() {
    const columns = {};
    columns.a = 0;
    columns.b = 1;
    columns.c = 2;
    columns.d = 3;
    columns.e = 4;
    columns.f = 5;
    columns.g = 6;
    columns.h = 7;

    return columns;
  }

  createBoard() {
    let board = {};

    for (let key in this.columns) {
      if (this.columns.hasOwnProperty(key)) {
        for (let n = 1; n <= 8 ; ++n) {
          let row = key + n;
          board[row] = null;
        }
      }
    }

    board = this.initPlayers(board);

    return board;
  }

  initPlayers(board) {
    const player1 = ['h1', 'h3', 'h5', 'h7', 'g2', 'g4', 'g6', 'g8', 'f1', 'f3', 'f5', 'f7'];
    const player2 = ['a2', 'a4', 'a6', 'a8', 'b1', 'b3', 'b5', 'b7', 'c2', 'c4', 'c6', 'c8'];

    let self = this;

    player1.forEach(function (i) {
      board[i] = self.createPiece(i, 'player1');
    });

    player2.forEach(function (i) {
      board[i] = self.createPiece(i, 'player2');
    });

    return board;
  }

  createPiece(location, player) {
    let piece = {};

    piece.player   = player;
    piece.location = location;
    piece.isKing   = false;

    return piece;
  }

  handleOnclick = (cordinates) => {
    let clickedSquare = this.state.boardState[cordinates];

    if(clickedSquare !== null) {
      if(clickedSquare.player !== this.state.currentPlayer) {
        return;
      }
      let movesData = this.checker.getMoves(this.state.boardState, cordinates, clickedSquare.isKing, false);

      this.setState({
        activePiece: cordinates,
        moves: movesData[0],
        jumpKills: movesData[1],
      });
    }

    if(this.state.activePiece === null) {
      return;
    }

    if(this.state.moves.length > 0) {
      let postMove = this.checker.movePiece(cordinates, this.state);
      console.log(postMove);

      if(postMove === null) {
        return;
      }

      this.setState({
        boardState: postMove.boardState,
        currentPlayer: postMove.currentPlayer,
        moves: postMove.moves,
        activePiece: postMove.activePiece,
        jumpKills: postMove.jumpKills,
        hasJumped: postMove.hasJumped,
        winner: postMove.winner,
      });
    }
  }

  playAgainClick = () => {
    this.setState({
      players: null,
      boardState: this.createBoard(),
      currentPlayer: 'player1',
      activePiece: null,
      moves: [],
      jumpKills: null,
      hasJumped: null,
      winner: null,
    });
  }

  showWins = (gameStatus) => {
    let winRender = (
      <div className="winModal">
        <h2>{gameStatus}</h2>
        <button onClick={this.playAgainClick}>Play Again</button>
      </div>
    )

    return gameStatus ? winRender : null;
  }

  render() {
    const columns = this.columns;
    const activePiece = this.state.activePiece;
    const boardState = this.state.boardState;
    const currentPlayer = this.state.currentPlayer;
    const moves = this.state.moves;

    let gameStatus = null;

    if(this.state.winner === 'player1') {
      gameStatus = 'Black wins';
    } 
    if(this.state.winner === 'player2') {
      gameStatus = 'Red wins';
    }

    return (
      <div>
        {this.showWins(gameStatus)}
        <Board 
          boardState = {boardState}
          currentPlayer = {currentPlayer}
          activePiece = {activePiece}
          moves = {moves}
          onClick={this.handleOnclick}
          columns = {columns} />
      </div>
    )
  }
}