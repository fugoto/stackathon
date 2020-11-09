import React from "react";
import * as handTrack from 'handtrackjs';
// const handTrack = window.handTrack;


const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}


export default class App extends React.Component {
	constructor() {
		super()
		this.state = {
			isVideo: false,
			model: null,
		}
		this.video = React.createRef();
		this.canvas = React.createRef();
		this.context = canvas.getContext("2d");
		this.trackButton = React.createRef();
		this.updateNote = React.createRef();
		this.startVideo = this.startVideo.bind(this)		
		this.toggleVideo = this.toggleVideo.bind(this)		
	}

	startVideo() {
		handTrack.startVideo(this.video).then(function (status) {
			console.log("video started", status);
			if (status) {
				// updateNote.innerText = "Video started. Now tracking"
				this.setState({ isVideo: true })
				this.runDetection()
			} else {
				console.log('please enable video')
				// updateNote.innerText = "Please enable video"
			}
		});
	}

	toggleVideo() {
		if (!this.state.isVideo) {
			// updateNote.innerText = "Starting video"
			this.startVideo();
		} else {
			// updateNote.innerText = "Stopping video"
			handTrack.stopVideo(video)
			this.setState({ isVideo: false });
			// updateNote.innerText = "Video stopped"
		}
	}

	runDetection() {
		this.state.model.detect(this.video).then(predictions => {
			console.log("Predictions: ", predictions);
			this.state.model.renderPredictions(predictions, this.canvas, this.context, this.video);
			if (this.state.isVideo) {
				requestAnimationFrame(this.runDetection);
			}
		});
	}
// Load the model.
	componentDidMount(){
		handTrack.load(modelParams).then(lmodel => {
			// detect objects in the image.
			this.setState({ model: lmodel })
			// updateNote.innerText = "Loaded Model!"
			// this.trackButton.disabled = false
		});		
	}

	render() {
		return(
			<>
			<h1>test</h1>
			<div className="p20">
			Handtrack.js allows you prototype handtracking interactions in the browser in 10 lines of code.
		  </div>
		  <div className="mb10">
			<button ref={this.trackButton} onclick="toggleVideo()" id="trackbutton" className="bx--btn bx--btn--secondary" type="button">
			  Toggle Video
			</button>
			<div ref={this.updateNote} id="updatenote" className="updatenote mt10"> loading model ..</div>
		  </div>
		  <video ref={this.video} className="videobox canvasbox" autoplay="autoplay" id="myvideo"></video>
		  <canvas ref={this.canvas} id="canvas" className="border canvasbox"></canvas>
		  </>
		)
	}
}

