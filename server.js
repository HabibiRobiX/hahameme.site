import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

// Asta e necesară pentru ca Node să știe unde e fișierul tău actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servim fișierele statice (cum ar fi style.css)
app.use(express.static(__dirname));

// Când cineva intră pe /, trimitem index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Pornim serverul
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
