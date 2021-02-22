const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
    createdDate:{
        type:Date,default:Date.now
    },
    startCountry: String,
    endCountry: String,
    startCity: String,
    endCity: String,
    startFlag: String,
    endFlag: String,
    startDate: Date,
    endDate: Date,
    phoneNumber: String,
    additionalInformation: String,
    likeCount: {
        type: Number,
        default: 0
    },
});

var post = mongoose.model('post', postSchema);

module.exports = post