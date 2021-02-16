const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const leaderBoard = new Schema({
	name: {
			type    : String,
			unique   : true,
			trim    : true,
			required: [true, 'Le nom est obligatoire']
	},
	score: {
			type: int,
			trim: true
	}
})

leaderBoard.pre('save', function(next) {
	console.log('Data pre save')
	next()
})

module.exports = mongoose.model('leaderBoard', leaderBoard)

//https://medium.com/@sbesnier1901/premi%C3%A8re-api-rest-avec-node-js-et-mongodb-sous-docker-884bda9d8e07