
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
// in this normally backend we write const express = requrie("") type but here not for this noly you need to go in
// package.json and type : "module"
import env from "dotenv";

import postRoutes from './routes/posts.js';
import userRouter from "./routes/user.js";

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
// both commend for just post request send sutable way
app.use(cors());

app.use("/posts", postRoutes);
app.use("/user", userRouter);

app.get('/',(req, res) => {
  res.send("App is running");
})
const CONNECTION_URL = `mongodb+srv://sonu123:sonu123@cluster0.6jgqs.mongodb.net/?retryWrites=true&w=majority`;
const PORT = process.env.PORT|| 5000;
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);



