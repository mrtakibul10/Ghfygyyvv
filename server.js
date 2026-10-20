const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// সার্ভার কনফিগারেশন ডেটা
const serverConfig = {
    serverName: "LokiCraft Official World 🌍",
    ip: "lokicraft-server.onrender.com",
    port: 19132,
    maxPlayers: 20,
    version: "1.20.0"
};

// ভার্চুয়াল বট ও প্লেয়ার ট্র্যাকার
let activeBots = [
    { name: "Bot_Loki_1", status: "Active in-game" },
    { name: "Bot_Loki_2", status: "Active in-game" }
];

// ১. API Endpoint (গেম অ্যাপ অটো-সার্চ করার জন্য)
app.get('/api/server-info', (req, res) => {
    res.json({
        success: true,
        name: serverConfig.serverName,
        ip: serverConfig.ip,
        port: serverConfig.port,
        onlinePlayers: activeBots.length + 1, // বট + অ্যাক্টিভ প্লেয়ার
        maxPlayers: serverConfig.maxPlayers,
        version: serverConfig.version,
        status: "ONLINE"
    });
});

// ২. Keep-Alive Bot pinging (Render কে স্লিপে যাওয়া থেকে আটকানোর জন্য)
setInterval(() => {
    const renderUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    http.get(`${renderUrl}/api/server-info`, (resp) => {
        console.log(`[BOT SYSTEM] Keep-Alive Ping Sent! Server Status: ONLINE (${new Date().toLocaleTimeString()})`);
    }).on("error", (err) => {
        console.log("[BOT SYSTEM] Ping error: " + err.message);
    });
}, 5 * 60 * 1000); // প্রতি ৫ মিনিট পর পর বট রিকোয়েস্ট পাঠাবে

// সার্ভার রানিং মেসেজ
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`LokiCraft Server Running on Port ${PORT}`);
    console.log(`=================================`);
});