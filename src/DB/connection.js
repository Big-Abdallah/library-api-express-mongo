import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({path:"./src/config/dev.env"}); 


// connect
export const sequelize = new Sequelize ( process.env.DB_NAME,  process.env.DB_USER ,process.env.DB_PASSWORD  , {
    host:process.env.DB_HOST ,
    port :process.env.DB_PORT ,
    dialect : "mysql"
} )
// test connect
export  const connectDB = async()=>{
    try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    } catch (error) {
    console.error('Unable to connect to the database:', error);
    }
}
export const syncTables = async ()=>{
    try{
        await sequelize.sync({force :false , alter : false});
        console.log("Table Synced")
    }catch(error){
        console.log("Unable to sync database" , error.message)
    }
}
