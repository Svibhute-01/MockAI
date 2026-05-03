import axios from "axios";

export const askAi = async (msg) => {
  try {
    if (!msg || !Array.isArray(msg) || msg.length === 0) {
      throw new Error("Message array is empty.");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: msg,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
          "X-OpenRouter-Title": "MockAI",
        },
      }
    );

    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content || !content.trim()) {
      throw new Error("AI returned empty response.");
    }

    return content;

  } catch (error) {
    console.error("AI Error:", error.response?.data || error.message);
    throw error;
  }
};