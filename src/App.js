import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const askAI = async () => {
    const res = await fetch("http://localhost:8080/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>💬 AI Chat</h2>
      <textarea
        rows="3"
        style={{ width: "100%" }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask the AI something..."
      />
      <br />
      <button onClick={askAI} style={{ marginTop: "10px" }}>
        Send
      </button>
      <h3>AI says:</h3>
      <pre>{response}</pre>
    </div>
  );
}

export default App;
