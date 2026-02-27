if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const mongoose = require("mongoose")
const url = process.env.URL
const Listing = require("../models/listing.js")
const initData= require("./data.js")

main()
.then(()=>{
    console.log("mongoDB connection Established..!!")
})
.catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect(url)
}

async function initDB(){
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj)=>({...obj,owner:"6971c147bb6f77779e0bd3e1"}));
    await Listing.insertMany(initData.data)
    console.log("data was inserted")
}

initDB();