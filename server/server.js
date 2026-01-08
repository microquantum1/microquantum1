import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Company API
app.get("/api/company", (req, res) => {
  res.json({
    name: "Nexora Systems",
    mission: "Engineering the future through intelligent technology.",
    services: [
      "AI Solutions",
      "Cloud Infrastructure",
      "Cybersecurity",
      "Enterprise Software"
    ]
  });
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log("Contact Request:", name, email, message);
  res.status(200).json({ success: true });
});

app.listen(3000, () => {
  console.log("🏢 Nexora Systems running at http://localhost:3000");
});
