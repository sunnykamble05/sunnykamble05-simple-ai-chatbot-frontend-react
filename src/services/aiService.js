// API service for AI backend communication
const API_BASE_URL = "http://localhost:8080/api";

export const aiService = {
  /**
   * Send a prompt to the AI and get response
   * @param {string} prompt - User's question/message
   * @returns {Promise<string>} - AI response text
   */
  async sendMessage(prompt) {
    try {
      const response = await fetch("http://localhost:8080/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response structures
      if (data.response) return data.response;
      if (data.message) return data.message;
      if (data.text) return data.text;
      
      return JSON.stringify(data);
    } catch (error) {
      console.error("AI Service Error:", error);
      throw new Error(error.message || "Failed to connect to AI service");
    }
  },
};