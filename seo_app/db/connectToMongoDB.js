const mongoose = require("mongoose");

const connectToMongoDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to MongoDb");
    } catch (error) {
        console.log("error connecting to mongoDb", error.message);
    }
};

module.exports = connectToMongoDb;
