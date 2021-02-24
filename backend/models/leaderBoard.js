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

leaderBoard.methods.makeItSave = async function (){
  const value = await ldBoard.findOne({ name: this.name }).exec()
  console.log('value', value)

  if (value === null){
    this.save(function (err) {
      if (err) return console.log(err)
        console.log('saved!')
    })
  }
  else{
    if (this.score > value.score)
      await ldBoard.updateOne({ name: this.name }, { score: this.score });
    else
      console.log('nothing to update')
  }
}



export const ldBoard = mongoose.model('ldBoard', leaderBoard)

//module.exports = mongoose.model('leaderBoard', leaderBoard)

//https://medium.com/@sbesnier1901/premi%C3%A8re-api-rest-avec-node-js-et-mongodb-sous-docker-884bda9d8e07