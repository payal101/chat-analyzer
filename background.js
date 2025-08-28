chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyzeEmotion",
    title: "🔍 Analyze Emotion",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "analyzeEmotion" && info.selectionText) {
    // Save selected text in local storage
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      console.log("✅ Text saved for analysis:", info.selectionText);
      // No openPopup here, popup opens only when user clicks extension icon
    });
  }
});

