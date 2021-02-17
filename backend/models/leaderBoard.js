import mongoose from 'mongoose'
const { Schema } = mongoose

const leaderBoard = new Schema({
	name: {
			type: String,
			unique: true,
			trim: true,
			required: [true, 'Le nom est obligatoire']
	},
	score: {
			type: Number,
			trim: true
	}
})

async function test(){
  const value = await leaderBoard.findOne({ name: 'totod' }).exec() //await .exec();
	console.log('value', value)
	return value
}

leaderBoard.pre('save', function(next) {
	//if name exist modify score else create name score
	//	return
	if (test() === null)
		return
	console.log('Data pre save')
	next()
})

module.exports = mongoose.model('leaderBoard', leaderBoard)

//https://medium.com/@sbesnier1901/premi%C3%A8re-api-rest-avec-node-js-et-mongodb-sous-docker-884bda9d8e07