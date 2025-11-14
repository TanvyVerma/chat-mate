import express from 'express'
import { generate } from './app.js';
import cors from 'cors';

const app = express()
const port = process.env.PORT;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Chat Mate')
});


app.post('/chat', async (req, res) => {
  const {message} = req.body;
  console.log("message", message);
  const result = await generate(message);
  res.json({message:  result});
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})