const mongoose = require('mongoose');

const connectToMongo = async () => {
   try {
       mongoose.set('strictQuery', false)
       await mongoose.connect(process.env.mongo_URI, { useNewUrlParser: true}) 
       console.log('Connected to Mongo Succesfully!!! ')
   } catch(error) {
       console.log(error)
       process.exit()
   }
}

module.exports = connectToMongo;