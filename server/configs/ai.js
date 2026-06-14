import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log("API KEY:", process.env.GEMINI_API_KEY?.slice(-6));

export default genAI;