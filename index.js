const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 5000;

//welcome site
app.get("/", (req, res) => {
  res.send("WElcome to our website");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bfpqs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  //Blogs collection
  const blogsCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("blogs");

  //add blog in website
  app.post("/addBlog", (req, res) => {
    const blogs = req.body;
    console.log(blogs)
    blogsCollection.insertOne(blogs).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //load all blogs
  app.get("/allBlogs", (req, res) => {
    blogsCollection.find({}).toArray((err, blogs) => {
      res.send(blogs);
    });
  });

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})