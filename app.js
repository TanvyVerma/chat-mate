import Groq from "groq-sdk";
import dotenv from "dotenv";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 }); //24 hour memory backup

export async function generate(userMsg, threadId) {
  const baseMsg = [
    {
      role: "system",
      content: `You are a smart and reliable personal assistant.

Your goal is to answer user questions accurately, using your built-in knowledge when possible and using tools only when necessary.

-----------------------------------------
TOOL ACCESS
-----------------------------------------
You have access to the following tool:

1. webSearchExample(query: string)
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
current date and time is: ${new Date().toUTCString()}

Q: What is the capital of France?
A: The capital of France is Paris.

Q: What is the weather in Mumbai right now?
A: (Use searchwer tool with query: "weather in Mumbai right now")

Q: Who is the Prime Minister of India?
A: The answer to this can change depending on the time and current government.`,
    },
  ];

  const messages = cache.get(threadId) ?? baseMsg;

  messages.push({
    role: "user",
    content: userMsg,
  });

  const MAX_RETRIES = 10;
  let count = 0;

  while (true) {
    if (count > MAX_RETRIES) {
      return "I could not find the answer, please try again";
    }
    count++;

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
      cache.set(threadId, messages);
      console.log(JSON.stringify(cache.data));
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
