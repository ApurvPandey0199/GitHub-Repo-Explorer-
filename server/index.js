require('dotenv').config();
const express = require('express');
const cors = require('cors');
const githubRoutes = require('./routes/github');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: ['http://localhost:5173', 'https://your-app.vercel.app'] }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/github', githubRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
