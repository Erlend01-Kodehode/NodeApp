import fs, { promises as fsPromises } from "fs";
import { join, extname } from "path";

import eventLogger from "../eventLogger.mjs";

import http from "http";

const { dirname } = import.meta;

const PORT = process.env.PORT || 3500;

const server = http.createServer(async (req, res) => {
  eventLogger(`${req.method} @ ${req.url}`);

  const extension = extname(req.url);

  let contentType;
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "text/json";
      break;
    case ".jpg":
      contentType = "text/jpg";
      break;
    case ".png":
      contentType = "text/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }

  let filePath =
    contentType === "text/html" && req.url === "/"
      ? join(dirname, "views", "index.html")
      : contentType === "text/html" && req.url.endsWith("/")
      ? join(dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? join(dirname, "views", req.url)
      : join(dirname, req.url);

  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const serveFile = async (filePath, contentType, response) => {
    try {
      const data = await fsPromises.readFile(filePath, "utf8");
      response.writeHead(200, { "Content-Type": contentType });
      response.end(data);
    } catch (err) {
      console.log(err);
      response.statusCode = 500;
      response.end();
    }
  };

  if (fs.existsSync(filePath)) {
    serveFile(filePath, contentType, res);
  } else {
    // 404
    serveFile(join(dirname, "views", "404.html"), contentType, res);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
