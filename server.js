const http = require("http");

http.createServer((req, res) => {
  res.end("This is my response!");
});

http.listen(3000, () => {
  console.log("Server listining on 3000");
});
