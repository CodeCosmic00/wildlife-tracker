const fs = require("fs");
const path = require("path");

async function loadSightings() {
  try {
    const filePath = path.join(__dirname, "..", "data", "sightings.json");
    const jsonData = await fs.promises.readFile(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    if (!Array.isArray(data.sightings)) {
      throw new Error("Invalid JSON format");
    }

    return data.sightings;
  } catch (error) {
    console.error("Data loading error:", error);
    throw new Error("Unable to load sightings data");
  }
}

module.exports = { loadSightings };
