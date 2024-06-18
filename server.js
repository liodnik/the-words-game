const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

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

        const oneMonth = 30 * 24 * 60 * 60;
        res.setHeader("Cache-Control", `public, max-age=${oneMonth}`);

        // Enable gzip compression
        res.setHeader("Content-Encoding", "gzip");
        zlib.gzip(data, (err, compressedData) => {
          if (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to compress data" }));
          } else {
            res.end(compressedData);
          }
        });
      }
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Endpoint not found" }));
  }
});

// Function to determine level/archive-names
const getNameByLevel = (level) => {
  const names = ["1", "2", "3"];
  const index = (level - 1) % names.length;
  return names[index];
};

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
