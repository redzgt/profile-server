import express from "express";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());

const profiles = {};

app.post("/create", (req, res) => {
  const id = nanoid(6);
  profiles[id] = req.body;
  res.json({ url: `https://your-railway-app.up.railway.app/${id}` });
});

app.get("/:id", (req, res) => {
  const profile = profiles[req.params.id];
  if (!profile) return res.status(404).send("Not found");
  res.send(`
    <h1>${profile.name}</h1>
    <p>@${profile.handle}</p>
    <p>${profile.bio}</p>
    ${profile.links.map(l => `<a href="${l}">${l}</a><br>`).join("")}
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
