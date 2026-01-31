/********************************************************************************
* WEB322 - Assignment 01
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Sandesh Adhikari  Student ID: 189503238  Date: 2026-01-31
*
********************************************************************************/

require("dotenv").config();

const express = require("express");
const path = require("path");
const { loadSightings } = require("./utils/dataLoader");

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// GET all sightings
app.get("/api/sightings", async (req, res) => {
  const data = await loadSightings();
  res.json(data);
});

// GET verified sightings
app.get("/api/sightings/verified", async (req, res) => {
  const data = await loadSightings();
  res.json(data.filter(s => s.verified === true));
});

// GET unique species list
app.get("/api/sightings/species-list", async (req, res) => {
  const data = await loadSightings();
  const species = [...new Set(data.map(s => s.species))];
  res.json(species);
});

// GET forest habitat sightings
app.get("/api/sightings/habitat/forest", async (req, res) => {
  const data = await loadSightings();
  const forest = data.filter(s => s.habitat === "forest");

  res.json({
    habitat: "forest",
    sightings: forest,
    count: forest.length
  });
});

// Search for eagle
app.get("/api/sightings/search/eagle", async (req, res) => {
  const data = await loadSightings();
  const found = data.find(s =>
    s.species.toLowerCase().includes("eagle")
  );

  found
    ? res.json(found)
    : res.status(404).json({ error: "No eagle found" });
});

// Find index of moose
app.get("/api/sightings/find-index/moose", async (req, res) => {
  const data = await loadSightings();
  const index = data.findIndex(s => s.species === "Moose");

  index !== -1
    ? res.json({ index, sighting: data[index] })
    : res.status(404).json({ error: "Moose not found" });
});

// Get 3 most recent sightings
app.get("/api/sightings/recent", async (req, res) => {
  const data = await loadSightings();

  const recent = [...data]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
    .map(s => ({
      species: s.species,
      habitat: s.habitat,
      date: s.date
    }));

  res.json(recent);
});

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
