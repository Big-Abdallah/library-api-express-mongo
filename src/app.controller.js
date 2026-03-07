import dotenv from "dotenv"
import { blogRouter, userRouter } from "./modules/index.js";
import {connectDB, syncTables} from "./DB/connection.js";


dotenv.config({path : "./src/config/dev.env"})
const bootstrap = async (app , express)=>{
    app.use(express.json()) ; 
    await  connectDB() ;
    await syncTables() ;
    app.use("/user" , userRouter);
    app.use("/blog" , blogRouter);

    
}
export default bootstrap ;