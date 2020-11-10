import React from "react";
import * as handTrack from 'handtrackjs';
import step from '../../server/*uckHunt'

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}

const nTargets = 2 // later refactor on child component Options state
const gameSpeed = 500 // later refactor on child component Options state

const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

export default class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isVideo: false,
			model: null,
			message: "loading model...",
			coordinates: [],
			range: 100,
			nTargets: nTargets,
			gameSpeed: gameSpeed
		}
		this.img = React.createRef();
		this.screen = React.createRef();
		this.startVideo = this.startVideo.bind(this)
		this.toggleVideo = this.toggleVideo.bind(this)
		this.runDetection = this.runDetection.bind(this)
		this.getCoordinates = this.getCoordinates.bind(this)
		this.startGame = this.startGame.bind(this)
	}
	async startVideo() {
		const status = await handTrack.startVideo(video)
		if (status) {
			this.setState({ isVideo: true, message: "Video started. Now tracking" })
			// this.runDetection()
		} else {
			console.log('please enable video')
			this.setState({ message: "Please enable video" })
		}
	};
	toggleVideo() {
		if (!this.state.isVideo) {
			// updateNote.innerText = "Starting video"
			this.startVideo();
			this.setState({ message: "Starting video" })
		} else {
			// updateNote.innerText = "Stopping video"
			handTrack.stopVideo(video)
			this.setState({ isVideo: false, message: "Video stopped" });
		}
	}
//predictions: [ x, y, width, height ]
	runDetection() {
		this.state.model.detect(video).then(predictions => {
			// console.log("Predictions: ", predictions);
			this.state.model.renderPredictions(predictions, canvas, context, video);
			if(predictions[0]) {
				const [ x, y, width, height ] = predictions[0].bbox
				// console.log(x, y, width, height)
				this.determineHit(x, y, width, height)
			}
			if (this.state.isVideo) {
				window.requestAnimationFrame(this.runDetection);
			}
		});
	}
	getCoordinates() {
		const img = this.img.current;
		const target = img.getBoundingClientRect();
		// console.log(target.x, target.y, target.width, target.height);
	}
	//1160 490
	// 640 480
	determineHit(x, y, width, height) {
		const widthAdjustment = this.screen.current.clientWidth / video.width
		const heightAdjustment = this.screen.current.clientHeight / video.height
		const xAdj = x * widthAdjustment
		const yAdj = y * heightAdjustment
		const widthAdj = width * widthAdjustment
		const heightAdj = height * heightAdjustment
		const img = this.img.current;
		const target = img.getBoundingClientRect();
		const range = this.state.range
		if( xAdj <= target.x && (xAdj + widthAdj) >= (target.x + target.width) && yAdj <= target.y && (yAdj + heightAdj) >= target.y + target.height ) {
			console.log('HIT')
			img.style.display="none"
		}
	}
	async startGame(){
		this.startVideo();
		console.log('video loaded')
		const lmodel = await handTrack.load(modelParams)
		console.log('model loaded')
		await this.setState({ model: lmodel, message: 'model loaded' })
		this.runDetection();
		setInterval(step, this.state.gameSpeed);
	}

	render() {
		return(
			<>
			<div ref={this.screen} id='screen'>
			<div className="title">Duck Hunt!</div>
				<div className="score">Score: </div>
				<div className="duck left"  style={{left: 100 + 'px'}}></div>
				<div className="duck right"  style={{right: 200 + 'px'}}></div>
				{/* <div className="duck left"  style={{left: 300 + 'px'}}></div>
				<div className="duck left"  style={{left: 400 + 'px'}}></div>
				<div className="duck left"  style={{left: 500 + 'px'}}></div>
				<div className="duck left"  style={{left: 600 + 'px'}}></div>
				<div className="duck left"  style={{left: 700 + 'px'}}></div>
				<div className="duck left"  style={{left: 800 + 'px'}}></div> */}

				<button onClick={this.toggleVideo} id="trackbutton" className="bx--btn bx--btn--secondary" type="button">
      			Toggle Video
   		 		</button>
					<button onClick={this.startGame}>Start Game</button>
					<button onClick={this.getCoordinates}>test</button>
			<div id="updatenote" className="updatenote mt10">{this.state.message}</div>
			</div>
		  </>
		)
	}
}

