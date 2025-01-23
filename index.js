//index.js is an entry point of the application
//  "type": "module" so can import and export

// ******IMPORTS*****

// Load the Secret Variables  
import dotenv from "dotenv";
dotenv.config();
import express from "express"
//middleWare
import bodyParser from "body-parser"; 
//import DB connection
import './connection.js'; 
//import routes
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
//set policies for frontend to access the backend
import cors from "cors"; 
import swaggerUi from 'swagger-ui-express'; // Swagger UI
import YAML from 'yamljs'; // YAML parser


//*****create Node server uing express*****
const app =  express()


// Load the OpenAPI YAML file
const swaggerDocument = YAML.load('./openapi.yaml');

// Set up the Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(
    cors({
      origin: "*",
      methods: ["*"],
      credentials: true,
    })
  );

// Middleware to parse JSON data
app.use(bodyParser.json());

// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

//test
app.get('/api',(req,res) => {
  res.json({
    message: 'Task Manager API is working'
  })
});


// app.listen(PORT, ()=>{
//     console.log(`Server listening on port ${PORT}`);
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs are available at http://localhost:${PORT}/api-docs`);
});


//Base URLs
app.use("/api/users",userRoutes)
app.use("/api/tasks",taskRoutes)





