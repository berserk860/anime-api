const express = require("express");
const cors = require("cors");
const anime = require("./anime");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API homepage
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Anime API!",
        version: "2.0.0",
        endpoints: [
            "/api/anime",
            "/api/anime/trending",
            "/api/anime/featured",
            "/api/anime/search?q=naruto",
            "/api/anime/genre/Action",
            "/api/anime/1"
        ]
    });
});

// Get all anime
app.get("/api/anime", (req, res) => {
    res.json({
        success: true,
        total: anime.length,
        data: anime
    });
});

// Get trending anime
app.get("/api/anime/trending", (req, res) => {
    const result = anime.filter(item => item.trending);

    res.json({
        success: true,
        total: result.length,
        data: result
    });
});

// Get featured anime for homepage slider
app.get("/api/anime/featured", (req, res) => {
    const result = anime.filter(item => item.featured);

    res.json({
        success: true,
        total: result.length,
        data: result
    });
});

// Search anime by title
app.get("/api/anime/search", (req, res) => {
    const query = (req.query.q || "").trim().toLowerCase();

    if (!query) {
        return res.status(400).json({
            success: false,
            message: "Please provide a search query using ?q=naruto"
        });
    }

    const result = anime.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.alternativeTitles.some(title =>
            title.toLowerCase().includes(query)
        )
    );

    res.json({
        success: true,
        total: result.length,
        data: result
    });
});

// Get anime by genre
app.get("/api/anime/genre/:genre", (req, res) => {
    const genre = req.params.genre.toLowerCase();

    const result = anime.filter(item =>
        item.genre.some(g => g.toLowerCase() === genre)
    );

    res.json({
        success: true,
        total: result.length,
        data: result
    });
});

// Get anime by ID
app.get("/api/anime/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid anime ID"
        });
    }

    const result = anime.find(item => item.id === id);

    if (!result) {
        return res.status(404).json({
            success: false,
            message: "Anime not found"
        });
    }

    res.json({
        success: true,
        data: result
    });
});

// Start API server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Anime API running on port ${PORT}`);
});
