// CommonJS => const fs = require("fs");
// import fs from "fs";
import fsPromises from "fs/promises";
import { join } from "path";

import { v4 as uuid } from "uuid";
import { format } from "date-fns";

const { dirname } = import.meta;

const log = (msg) => {
  console.log("Log Updated", msg);
  return `${format(new Date(), "dd.MM.yyyy\tHH:mm:ss")}\t${uuid()}\t${msg}\n`;
};

await fsPromises.appendFile(join(dirname, "log.txt"), log("Dummy Message"));

// await fsPromises.writeFile(join(dirname, "test.txt"), "Dummy File");
// await fsPromises.appendFile(join(dirname, "test.txt"), "\nDummy Addition");
// const data = await fsPromises.readFile(join(dirname, "test.txt"), "utf-8");
// console.log(data);

// fs.readFile("./hello.txt", "utf-8", (err, data) => {
//   if (err) throw err;
//   console.log(data);
// });

// console.log("General Kenobi");

// fs.writeFile(join(dirname, "test.txt"), "Dummy File", (err) => {
//   if (err) throw err;
//   fs.appendFile(join(dirname, "test.txt"), "\nDummy Addition", (err) => {
//     if (err) throw err;
//     fs.readFile(join(dirname, "test.txt"), "utf-8", (err, data) => {
//       if (err) throw err;
//       console.log(data);
//     });
//   });
// });
