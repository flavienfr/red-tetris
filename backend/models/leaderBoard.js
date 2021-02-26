import mongoose from 'mongoose'
import ServerManager from '../ServerManager'

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

//TODO comprendre synchorne ici ca marche mais pk
leaderBoard.methods.makeItSave = async function (){
  console.log('-1')
  const value = await ldBoard.findOne({ name: this.name }).exec()
  console.log('0')

  if (value === null){
    console.log('1')
    this.save(function (err) {
      if (err)
        return console.log(err)
      console.log('2')
      ServerManager.emitLeaderBoard()
    })
  }
  else{
    if (this.score > value.score){
      await ldBoard.updateOne({ name: this.name }, { score: this.score })
      ServerManager.emitLeaderBoard()
    }
    else
      console.log('nothing to update')
      console.log('3')
  }
  console.log('4')
}



export const ldBoard = mongoose.model('ldBoard', leaderBoard)

//module.exports = mongoose.model('leaderBoard', leaderBoard)

//https://medium.com/@sbesnier1901/premi%C3%A8re-api-rest-avec-node-js-et-mongodb-sous-docker-884bda9d8e07