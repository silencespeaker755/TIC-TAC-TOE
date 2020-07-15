import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Square extends React.Component {

	render() {
		return (
			<button
				className="square"
				style={this.props.style}
				onClick={() => { this.props.onClick() }}
			>
				{this.props.value}
			</button>
		);
	}
}

class Board extends React.Component {

	renderSquare(i) {
		return (
			(i === this.props.set[0] || i === this.props.set[1] || i === this.props.set[2]) ?
				<Square
					value={this.props.squareState[i]}
					style={{border: '3px solid red'}}
					onClick={() => this.props.onClick(i)}
				/> :
				<Square
					value={this.props.squareState[i]}
					style={{border: '1px solid black'}}
					onClick={() => this.props.onClick(i)} />
		);
	}


	render() {

		const content = Array.from({ length: 3 }, (v1, i1) => {
			return (
				<div className="board-row">
					{Array.from({ length: 3 }, (v2, i2) => this.renderSquare(i1 * 3 + i2))
					}
				</div>
			);
		}
		);

		// const content = Array.from({ length: 3 }, (v1, i1) =>
		// 		<div className="board-row">
		// 			{Array.from({ length: 3 }, (v2, i2) => this.renderSquare(i1 * 3 + i2))
		// 			}
		// 		</div>
		// );

		return (
			<div>{content}</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			nowStep: 0,
			history: [{ squareState: Array(9).fill(null) }],
			xIsNext: true,
			posArea: [{ pos: [null, null] }],
			currentPos: 0
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.nowStep + 1);
		const posArea = this.state.posArea.slice(0, this.state.nowStep + 1);
		//console.log(posArea);
		const currentHistory = history[history.length - 1];
		const squareCopy = currentHistory.squareState.slice();
		if (squareCopy[i] || calculateWinner(squareCopy).player) {
			return;
		}
		squareCopy[i] = this.state.xIsNext ? "X" : "O";
		const nextPos = [Math.floor(i / 3), i % 3];
		//console.log(nextPos);
		this.setState({
			nowStep: history.length,
			history: history.concat([{ squareState: squareCopy }]),
			xIsNext: !this.state.xIsNext,
			posArea: posArea.concat([{ pos: nextPos }]),
			currentPos: this.state.currentPos + 1
		});
	}

	jumpBack(i) {
		this.setState({ nowStep: i, xIsNext: (i % 2 === 0), currentPos: i });
	}

	render() {
		const history = this.state.history;
		const currentState = history[this.state.nowStep].squareState;
		//console.log(this.state.posArea[0].pos);
		const currentPos = this.state.currentPos;
		const move = history.map((nowStep, backToSteps) => {
			const mesg = backToSteps ?
				"Go back to round " + backToSteps + " where position is (" + this.state.posArea[backToSteps].pos + ") !" :
				"Go back to start!";
			return (
				<li key={backToSteps}>
					{(currentPos === backToSteps) ?
						<button className="pos-button" onClick={() => this.jumpBack(backToSteps)}>{mesg}</button> :
						<button onClick={() => this.jumpBack(backToSteps)}>{mesg}</button>
					}
				</li>
			);
		});
		const winner = calculateWinner(currentState);
		let status;
		//console.log(winner.player);
		if (winner.player) {
			status = "Winner is " + winner.player;
		} else if (this.state.nowStep === 9){
			status = "Draw";
		} else {
			status = "Next Player is " + (this.state.xIsNext ? "X" : "O");
		}
		//console.log(status);
		return (
			<div className="game">
				<div className="game-board">
					<Board squareState={currentState} set={winner.set} onClick={(i) => this.handleClick(i)} />
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{move}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return { player: squares[a], set: [a, b, c] };
		}
	}
	return ({ player: null, set: [null, null, null] });
}