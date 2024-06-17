const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { url, method } = req;

  if (method === "GET" && url.startsWith("/level")) {
    const level = url.split("=")[1];

    const name = getNameByLevel(level);
    const filePath = path.join(__dirname, "data", `${name}.json`);

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Data not found" }));
      } else {
        res.setHeader("Content-Type", "application/json");
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Endpoint not found" }));
  }
});

// Looping level/archive-names
const getNameByLevel = (level) => {
  const names = ["1", "2", "3"];
  const index = (level - 1) % names.length;
  return names[index];
};

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
