const app = require('express')()
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const post = require("./models/post")
require('dotenv').config()

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URL

mongoose.connect(MONGODB_URI, {
    // useFindAndModify: false,
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
},() => {
    console.log(`database connected ${MONGODB_URI}`)
});

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())







app.get("/api/all",(req,res) => {
    console.log("GET method on /api/all ")
    post
        .find({},(err,posts) => {
            if(err) throw err

            // console.log(posts)
            res.send(posts)
        })
})

app.post("/api/new",(req,res) => {
    console.log("POST method on /api/new ")
    post.create(req.body)
        .then(newPost => {
            // console.log(`newPost from /: ${newPost}`)
            res.send(newPost)
        })
        .catch(e => {throw e})
})

app.post("/api/remove",(req,res) => {
    console.log("POST method on /api/remove ")
    post
        .findOneAndDelete({_id:req.body.postID},(err,removed) => {
            if(err) throw err
            // console.log(`post have been removed: ${removed}`)
            res.send(true)
        })
})

app.post("/api/toggleLike",async (req,res) => {
    var count = req.body.like ? 1 : -1

    var niyeolmuyorlan = await post.findOneAndUpdate({_id: req.body.id},{$inc: {likeCount: count}})

    res.send(niyeolmuyorlan.likeCount) // Umarım :)
})

app.post("/api/getSinglePost",async (req,res) => {

    console.log(req.body)


    var willSended = {
        post: {},
        similarPosts: [],
    }

    post.count({_id: req.body.id}, async function (err, count){
        if(count>0){
            await post
                .findOne({_id:req.body.id},async (err,post) => {
                    if(err) {
                        console.log(err)
                    }

                    willSended.post = await post
                })

            await post
                .find({
                    $and: [
                        {$or: [
                                {startCountry: willSended.post.startCountry},
                                {endCountry: willSended.post.endCountry},
                                {startCity: willSended.post.startCity},
                                {endCity: willSended.post.endCity},
                                {phoneNumber: willSended.post.phoneNumber},
                            ]},
                        {_id: {$ne: willSended.post._id}}
                    ]
                },(err,posts) => {
                    if(err) throw err

                    willSended.similarPosts = posts
                })

            console.log("\n\n\n\n\n\n\n\n\n Objecttttttttttt: ")
            console.log(willSended)
            res.send(willSended)
        }else {
            res.send(false)
        }
    });
})




app.listen(PORT,() => {
    console.log('server running: ' + PORT)
})



