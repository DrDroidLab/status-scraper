import express from "express";
import { chromium } from "playwright";

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/scrape", async (req, res) => {
  const url = req.query.url;

  if (!url || !url.startsWith("http")) {
    return res.status(400).json({ error: "Missing or invalid URL" });
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Try to extract the first visible "status" span
    const statusText =
      (await page.textContent('span[class*="status"]')) || "unknown";

    await browser.close();

    res.json({
      source: url,
      status: statusText.trim(),
    });
  } catch (err) {
    console.error("Scraping failed:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch status", detail: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Pass `?url=` to `/scrape` to fetch status.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
