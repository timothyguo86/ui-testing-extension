// Helper function to execute scripts or insert CSS
function executeScript(buttonId, scriptFiles, cssFiles = null) {
  document.getElementById(buttonId).addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      if (cssFiles) {
        chrome.scripting.insertCSS(
          {
            target: { tabId: tabId },
            files: cssFiles,
          },
          () => {
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: scriptFiles,
            });
          }
        );
      } else {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: scriptFiles,
        });
      }
    });
  });
}

// Event listeners
executeScript("toggleThemeBtn", ["content-scripts/theme.js"]);
executeScript("toggleOutlineModeBtn", ["content-scripts/outline-mode.js"]);
executeScript(
  "toggleInspectorModeBtn",
  ["content-scripts/inspector-mode.js"],
  ["content-css/inspector-mode.css"]
);
executeScript(
  "toggleRulerModeBtn",
  ["content-scripts/ruler-mode.js"],
  ["content-css/ruler-mode.css"]
);
