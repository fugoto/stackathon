const express = require("express")
//initialize app
const app = express()
const morgan = require('morgan')
const path = require('path')

//use morgan|volleyball
app.use(morgan('dev'))

app.use(express.static(path.join(__dirname,'./server/public')))

//404 handler
app.use(function(req,res,next){
    const err = new Error('Not found')
    err.status = 404
    next(err)
})

//500 handler
app.use(function(err,req,res,next){
    console.error(err,err.stack)
    res.status(err.status || 500)
    res.send('something wrong: ' + err.message)
})

//set PORT
async function init(){
    try{
        console.log('syncing')
        const PORT = process.env.PORT || 3000
        await app.listen(PORT, function(){
            console.log(`Listening at http://localhost:${PORT}`)
        })
    } catch(error) {
        console.error(error)
    }
}

//listen
init()
