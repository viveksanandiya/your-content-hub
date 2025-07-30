import mongoose from "mongoose"

const MONGODB_URL = process.env.MONGODB_URL || ''

if (!MONGODB_URL) {
  throw new Error('Please provide the MONGODB_URL environment variable');
}

async function dbConnect(): Promise<void> {

    try{
        await mongoose.connect(MONGODB_URL)
        
        console.log("db connected successfully ! ");
    
    }catch(error){
    console.log("db connection failed ", error)
        process.exit(1);
    }
}

export default dbConnect;