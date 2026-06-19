const mongoose = require('mongoose');


const connectDB = ()=>{
    try {
        mongoose.connect(process.env.MONGO_URL)
          .then(() => {
            console.log('MongoDB connected')})
        
    } catch (error) {
        console.error(error.message);
        
    }
}

module.exports = connectDB;