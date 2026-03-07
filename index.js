import express from "express" ;
import bootstrap from "./src/app.controller.js";

const app = express() ;
const PORT = process.env.PORT || 4500

bootstrap(app , express)

app.listen(PORT ,()=>{
    console.log(` Server Is Running on http://localhost:${PORT}`)
})