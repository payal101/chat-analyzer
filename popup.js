// When popup opens → grab selected text
window.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    });

    if (result) {
      document.getElementById("chatInput").value = result;
    }
  } catch (e) {
    console.error("Selection grab failed", e);
  }
});

document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const chatInput = document.getElementById("chatInput").value;
  const resultBox = document.getElementById("result");

  if (!chatInput.trim()) {
    resultBox.textContent = " No text selected. Please select some chat text first.";
    return;
  }

  resultBox.textContent = " Analyzing emotions...";

  try {
    const analysis = await analyzeChat(chatInput);
    resultBox.textContent = analysis;
  } catch (err) {
    console.error(err);
    resultBox.textContent = "Error analyzing chat.";
  }
});

async function analyzeChat(chatText) {
  const apiKey = "API/KEY/"; 

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `You are a chat analyzer. Read through the context and conversation and give the tone of reply of the other person. Give short concise responses. / Suspicious / Fraud, and a 1-line reason.\n\n${chatText}}` }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();
  console.log("Gemini response:", data);

  return data.candidates?.[0]?.content?.parts?.[0]?.text || " No response.";
}
