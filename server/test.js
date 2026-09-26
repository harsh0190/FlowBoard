require("dotenv").config();

fetch("https://api.groq.com/openai/v1/models", {
  headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
})
  .then((r) => r.json())
  .then((d) => {
    if (!d.data) return console.log("Unexpected response:", d);
    d.data
      .map((m) => m.id)
      .sort()
      .forEach((id) => console.log(id));
  })
  .catch((e) => console.log("FAILED:", e.message));