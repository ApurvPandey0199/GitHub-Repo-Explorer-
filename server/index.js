require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const githubRoutes = require('./routes/github');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // Allow all origins to prevent Network Errors when ports change
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/github', githubRoutes);

// Serve frontend static files in production
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

