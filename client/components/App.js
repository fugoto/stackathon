import React from "react";
import * as handTrack from 'handtrackjs';
// const handTrack = window.handTrack;

//need to move togglevideo from index html to render below. also can put updatenote as a <p>. need to figure out what trackbutton is. next steps: to put prediction on state
//sample prediction:
// 0:
// bbox: (4) [270.26879489421844, 94.34009146690369, 156.35127425193787, 149.49061799049377]
// class: 0
// score: 0.8765704035758972
const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}

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
		}
		this.startVideo = this.startVideo.bind(this)
		this.toggleVideo = this.toggleVideo.bind(this)
		this.runDetection = this.runDetection.bind(this)
	}

	async startVideo() {
		const status = await handTrack.startVideo(video)
		if (status) {
			// updateNote.innerText = "Video started. Now tracking"
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
			// updateNote.innerText = "Video stopped"
		}
	}

	runDetection() {
		this.state.model.detect(video).then(predictions => {
			console.log("Predictions: ", predictions);
			this.state.model.renderPredictions(predictions, canvas, context, video);
			if (this.state.isVideo) {
				window.requestAnimationFrame(this.runDetection);
			}
		});
	}
// Load the model.
	async componentDidMount(){
		await this.startVideo();
		console.log('video loaded')
		const lmodel = await handTrack.load(modelParams)
		console.log('model loaded')
		await this.setState({ model: lmodel, message: 'model loaded' })
		this.runDetection();
	}

	render() {
		return(
			<>
			<h1>test</h1>
			<button onclick={toggleVideo()} id="trackbutton" className="bx--btn bx--btn--secondary" type="button">
      		Toggle Video
    		</button>
			<div id="updatenote" className="updatenote mt10">{this.state.message}</div>
		  </>
		)
	}
}

