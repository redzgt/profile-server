import express from "express";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());

const profiles = {}; // in-memory store (use a DB later for persistence)

// Create profile
app.post("/create", (req, res) => {
  const id = nanoid(6);
  profiles[id] = req.body;
  res.json({ url: `${req.protocol}://${req.get("host")}/${id}` });
});

// View profile
app.get("/:id", (req, res) => {
  const profile = profiles[req.params.id];
  if (!profile) return res.status(404).send("Not found");

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${profile.name}'s Profile</title>
      <style>
        body { font-family: sans-serif; background:#0d1117; color:#e6edf3; text-align:center; padding:40px; }
        .avatar { width:120px; height:120px; border-radius:50%; background:#30363d url('${profile.avatar||""}') center/cover; margin:0 auto 20px; }
        a { display:block; margin:6px 0; color:#58a6ff; text-decoration:none; }
      </style>
    </head>
    <body>
      <div class="avatar"></div>
      <h1>${profile.name}</h1>
      <p>@${profile.handle}</p>
      <p>${profile.bio}</p>
      <div>
        ${(profile.links||[]).map(l => `<a href="${l}" target="_blank">${l}</a>`).join("")}
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
