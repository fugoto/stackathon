import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App"
import {HashRouter as Router} from 'react-router-dom'

//if using react router
// ReactDOM.render(<Router><App /></Router>, document.getElementById("app"))

//if not using react router
ReactDOM.render(<App />, document.getElementById("app"))
