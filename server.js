/********************************************************************************
* WEB322 - Assignment 01
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Sandesh Adhikari Student ID: 189503238 Date: 2026-02-01
*
********************************************************************************/

require("dotenv").config();
const express = require("express");
const path = require("path");
const { loadSightings } = require("./utils/dataLoader");

const app = express();

// Required for defining the public directory as static in Vercel:
app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/api/sightings", async (req, res) => {
  try {
    const sightings = await loadSightings();
    res.json(sightings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/sightings/verified", async (req, res) => {
  try {
    const sightings = await loadSightings();
    res.json(sightings.filter((s) => s.verified === true));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/sightings/species-list", async (req, res) => {
  try {
    const sightings = await loadSightings();
    const names = sightings.map((s) => s.species);
    res.json([...new Set(names)]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/sightings/habitat/forest", async (req, res) => {
  try {
    const sightings = await loadSightings();
    const forest = sightings.filter(
      (s) => String(s.habitat).toLowerCase() === "forest"
    );
    res.json({ habitat: "forest", sightings: forest, count: forest.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/sightings/search/eagle", async (req, res) => {
  try {
    const sightings = await loadSightings();
    const found = sightings.find((s) =>
      String(s.species).toLowerCase().includes("eagle")
    );
    res.json(found || { message: "No eagle sightings found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/sightings/find-index/moose", async (req, res) => {
  try {
    const sightings = await loadSightings();
    const index = sightings.findIndex(
      (s) => String(s.species).toLowerCase() === "moose"
    );
    res.json({ index, sighting: index >= 0 ? sightings[index] : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/sightings/recent", async (req, res) => {
  try {
    const sightings = await loadSightings();
    const recent3 = [...sightings]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
      .map((s) => ({
        id: s.id,
        species: s.species,
        habitat: s.habitat,
        date: s.date,
        verified: s.verified
      }));

    res.json(recent3);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}`));
