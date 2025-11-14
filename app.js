import Groq from "groq-sdk";
import dotenv from "dotenv";
import { tavily } from "@tavily/core";
import readline from "node:readline/promises";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function generate(usermsg) {
  const messages = [
    {
      role: "system",
      // content: `you are a smart assistant who answer the question asked. you can use external tools for web search. you have the access of following tools: 1. webSearchExample(query:string) - useful for when you need to answer questions about current events or the current state of the world. Use this tool to search the web for relevant information.
      //   current date and time is: ${new Date().toUTCString()}`,
      content: `You are a smart and reliable personal assistant.
      
Your goal is to answer user questions accurately, using your built-in knowledge when possible and using tools only when necessary.

-----------------------------------------
TOOL ACCESS
-----------------------------------------
You have access to the following tool:

1. searchwer(query: string)
   - Use this tool to search the internet for real-time, up-to-date, or unknown information.
   - Call this tool ONLY when:
       • The question requires current information (e.g., weather, latest events, new releases)
       • The information is not in your knowledge
       • You are uncertain about the answer

-----------------------------------------
BEHAVIOR GUIDELINES
-----------------------------------------
• If you confidently know the answer, respond directly in clear, simple English.
• If the answer requires real-time or updated data, use the search tool.
• NEVER guess or hallucinate.
• Do NOT mention the tool unless performing a tool call.
• Always return the final answer after using the tool.

-----------------------------------------
EXAMPLES
-----------------------------------------
Q: What is the capital of France?
A: The capital of France is Paris.

Q: What is the weather in Mumbai right now?
A: (Use searchwer tool with query: "weather in Mumbai right now")

Q: Who is the Prime Minister of India?
A: The answer to this can change depending on the time and current government.
`,
    },
  ];

  messages.push({
    role: "user",
    content: usermsg,
  });

  while (true) {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearchExample",
            description: "search the latest information and the realtime data",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "when was iPhone 16 launched",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    messages.push(completion.choices[0].message);

    const toolCalls = completion.choices[0].message.tool_calls;

    if (!toolCalls) {
      return completion.choices[0].message.content;
    }

    for (const toolCall of toolCalls) {
      const funcName = toolCall.function.name;
      const funcArgs = toolCall.function.arguments;

      if (funcName == "webSearchExample") {
        const toolResult = await webSearchExample(JSON.parse(funcArgs));

        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: funcName,
          content: toolResult,
        });
      }
    }
  }
}

async function webSearchExample({ query }) {
  console.log("calling web search...");

  const response = await tvly.search(query);
  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");
  return finalResult;
}
