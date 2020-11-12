import React from "react";
import * as handTrack from 'handtrackjs';
import step from '../../server/*uckHunt'

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}
// win result comes too early, fix that. look at lose - NEED TO LOOK AT THIS, start line 170
// fist should not appear in beginning
// bird explode
// do dog and grass
//awkward when bird is created (initial flight)
// set favicon
// dictator heads
// logo
// levels: speed, fist size, frequency of new target created
// 2 fists - xtra credit
const nTargets = 3 // later refactor on child component Options state (on click on child component with function passed in from App that will set state)
const gameSpeed = 500 // later refactor on child component Options state
let model = null
const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let targets = document.querySelectorAll(".target");

// let targets = document.querySelectorAll(".target");

let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

export default class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isVideo: false,
			message: "loading model...",
			coordinates: [],
			// errorMargin: 100,
			nTargets: nTargets,
			gameSpeed: gameSpeed,
			score: 0,
			result: '',
			inPlay: false,
		}
		this.targets = React.createRef();
		this.screen = React.createRef();
		this.fist = React.createRef();
		this.startVideo = this.startVideo.bind(this)
		this.toggleVideo = this.toggleVideo.bind(this)
		this.runDetection = this.runDetection.bind(this)
		this.getCoordinates = this.getCoordinates.bind(this)
		this.startGame = this.startGame.bind(this)
		this.addTarget = this.addTarget.bind(this)
		this.determineHit = this.determineHit.bind(this)
	}
	async startVideo() {
		const status = await handTrack.startVideo(video)
		if (status) {
			this.setState({ isVideo: true, message: "Video started. Now tracking" })
		} else {
			console.log('please enable video')
			this.setState({ message: "Please enable video" })
		}
	};
	toggleVideo() {
		if (!this.state.isVideo) {
			this.startVideo();
			this.setState({ message: "Starting video" })
		} else {
			handTrack.stopVideo(video)
			this.setState({ isVideo: false, message: "Video stopped" });
		}
	}
//predictions: [ x, y, width, height ]
	runDetection() {
		model.detect(video).then(predictions => {
			// console.log("Predictions: ", predictions);
			model.renderPredictions(predictions, canvas, context, video);
			// this.playGame();
			if(predictions[0]) {
				const [ x, y, width, height ] = predictions[0].bbox
				// console.log(x, y, width, height)
				const [xAdj, yAdj, widthAdj, heightAdj] = this.adjustPos(x, y, width, height)
				// console.log('before:', x, y, width, height)
				// console.log('after:', xAdj, yAdj, widthAdj, heightAdj)
				const fistPos = this.fist.current.getBoundingClientRect();
				// this.fist.current.style.left = xAdj + widthAdj / 2  - fistPos.width/2
				// this.fist.current.style.top = yAdj + heightAdj /2 - fistPos.height/2

				$(".fist").animate({ 
					left: xAdj + widthAdj / 2  - fistPos.width/2,
					top: yAdj + heightAdj /2 - fistPos.height/2}, 1);

				this.determineHit(xAdj, yAdj, widthAdj, heightAdj)
			}
			if (this.state.isVideo) {
				window.requestAnimationFrame(this.runDetection);
			}
		});
	}

	getCoordinates() {
		const target = this.targets.current.getBoundingClientRect();
		console.log(target.x, target.y, target.width, target.height);
	}
	//1160 490
	// 640 480
	adjustPos(x, y, width, height){
		console.log('screenwidth', this.screen.current.clientWidth, 'screenheight', this.screen.current.clientHeight);console.log('vidwidth',video.width, 'vidheight', video.height);

		const widthAdjustment = this.screen.current.clientWidth / video.width
		const heightAdjustment = this.screen.current.clientHeight / video.height
		const xAdj = x * widthAdjustment
		const yAdj = y * heightAdjustment
		const widthAdj = width * widthAdjustment
		const heightAdj = height * heightAdjustment
		return [xAdj, yAdj, widthAdj, heightAdj]
	}
	determineHit(xAdj, yAdj, widthAdj, heightAdj) {
		// const widthAdjustment = this.screen.current.clientWidth / video.width
		// const heightAdjustment = this.screen.current.clientHeight / video.height
		// const xAdj = x * widthAdjustment
		// const yAdj = y * heightAdjustment
		// const widthAdj = width * widthAdjustment
		// const heightAdj = height * heightAdjustment

		targets.forEach(target => {
			const targetPos = target.getBoundingClientRect();
			if( xAdj <= targetPos.x && (xAdj + widthAdj) >= (targetPos.x + targetPos.width) && yAdj <= targetPos.y && (yAdj + heightAdj) >= (targetPos.y + targetPos.height) ) {
				console.log('HIT')
				target.style.display="none"
				this.setState({score: this.state.score + 1})
			}
		});
	}
	addTarget(){
		const directions = ['left', 'right']
		const targetDirection = directions[Math.floor(Math.random() * directions.length)]
		const initialPos = Math.floor(this.screen.current.clientWidth * Math.random())
		$('#targets').append(`<div class="target ${targetDirection}" style="${targetDirection}: ${initialPos}px"></div>`)
		}

	async startGame(){
		console.log('starting game')
		// DO NOT DELETE BELOW if commented out!!!!!!!!!!
		// const [ videoStatus, lmodel ] = await Promise.all([
		// 	this.startVideo(),
		// 	handTrack.load(modelParams)
		// ]);
		// model = lmodel
		// console.log('model loaded')
		// this.runDetection();
		// this.setState({ message: 'model loaded' })
		setInterval(step, this.state.gameSpeed);
		// defining "self" becuase cant access state inside setInterval
		const self = this;
		let nTargets = this.state.nTargets;
		let createdTargets = 0;
		const createTargets = setInterval(function(){
			self.addTarget();
			self.checkGameEnd()
			createdTargets++
			console.log('created',createdTargets, 'total',nTargets)
			if(createdTargets === nTargets) {
				clearInterval(createTargets)
				createdTargets = 0
				// while(true){
					if(self.checkGameEnd()){
						console.log('gameend',self.checkGameEnd())
						if((self.state.score / self.state.nTargets) >= .6) {
							self.setState({result: 'YOU WIN'})
						}
						else {
							self.setState({result: 'YOU LOSE'})
						}
					}
				}
			// }	
		}, 8000)
		
		// result
	}

	checkGameEnd(){

		document.addEventListener('DOMContentLoaded', function(){
		for(let i = 0; i < targets.length; i++) {
			let target = targets[i]
			console.log('target',target)
			if(target.style.display !== 'none') return false
		}
		return true
	});
		// if (!targets.length) return false
		console.log(targets.length)
		// for(let i = 0; i < targets.length; i++) {
		// 	let target = targets[i]
		// 	console.log('target',target)
		// 	if(target.style.display !== 'none') return false
		// }
		// targets.forEach(target => {
		// 	if(target.style.display !== 'none') return false
		// })
	}

	render() {
		return(
			<>
			<div ref={this.screen} id='screen'>
			<div className="title">Duck Hunt!</div>
				<div className="score">Score: {this.state.score} / {this.state.nTargets}</div>
				<img className="fist" ref={this.fist} src='/images/fist.png'></img>
				<div id='targets' ref={this.targets}></div>
				<h1>{this.state.result}</h1>
				<button onClick={this.toggleVideo} id="trackbutton" className="bx--btn bx--btn--secondary" type="button">
      			Toggle Video
   		 		</button>
				<button onClick={this.startGame}>Start Game</button>
				{/* <button onClick={this.getCoordinates}>test</button> */}
				<div id="updatenote" className="updatenote mt10">{this.state.message}</div>
			</div>
		  </>
		)
	}
}

