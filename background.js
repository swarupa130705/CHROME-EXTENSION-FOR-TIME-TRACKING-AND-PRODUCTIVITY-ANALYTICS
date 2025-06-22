let currentTab = null;
let activeStart = null;

console.log("🔧 Background script loaded");

function trackTime() {
  if (currentTab && activeStart) {
    const now = Date.now();
    const duration = now - activeStart;
    console.log(`⏱️ Time spent on ${currentTab}: ${Math.round(duration / 1000)}s`);
  }
}

chrome.runtime.onStartup.addListener(() => {
  console.log("🔄 runtime.onStartup fired");
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log("❗ onActivated fired with tabId:", activeInfo.tabId);
  trackTime();

  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    console.log("📦 tab object received:", tab);

    if (!tab.url) {
      console.warn("⚠️ tab.url missing", tab);
      return;
    }
    if (!tab.url.startsWith("http")) {
      console.warn("⚠️ non-http URL skipped:", tab.url);
      return;
    }

    currentTab = new URL(tab.url).hostname;
    activeStart = Date.now();
    console.log("✅ Now tracking:", currentTab);

  } catch (e) {
    console.error("❌ Error in onActivated:", e);
  }
});

