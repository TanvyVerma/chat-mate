import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import dotenv from "dotenv";

dotenv.config();


const groq = new Groq({apiKey: process.env.GROQ_API_KEY});
const tvly = new Groq({apiKey: process.env.TAVILY_API_KEY});


const completion = groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
        {
            role: "user",
            content: "hii",
        },
        {
            role: "system",
            content: "you are a smart assistant who answer the question asked"
        }
    ],
    tools: [
        
    ]
})



