require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [{
    username: "Austin",
    title: 'post 1'
},  {
    username: "David",
    title: 'post 2'
}]


 //post route 
 app.get("/posts", authenticateToken, (req, res) => {
     res.json(posts.filter(post => post.username === req.user.name))
 })


 //login route
 //Authicating the user  
app.get("/login", (req,res) =>{
    const username = req.body.username
    const user = {name: username}
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken})
} )

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403) // token no longer valid 403
        req.user = user
        next()
    })
}

 app.listen(3000)