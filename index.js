const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./User");
const Post = require("./Post");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

// middlewares to parse the data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connecting to local mongoDB database named usersdb
const connectionString = "mongodb://localhost:27017/usersdb";
mongoose.set("strictQuery", true).connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database Connection Successfully Established");
});

// bcrypt password hashing  (!should never store password without hashing)
const hashPassword = async (password, saltRounds = 10) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.log(error);
  }
  return null;
};

// dummy Function
let sendMail = (subject, body, email) => {
  return "mail sent";
};

// POST route for adding new user.
app.post("/user", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: await hashPassword(req.body.password),
    });
    await newUser.save();
    res.send("ok added the user");
  } catch (err) {
    res.status(404).send(err.message);
  }
});

// GET route to get all the users
app.get("/user", async (req, res) => {
  try {
    const allUsers = await User.find({});
    return res.json(allUsers);
  } catch (err) {
    console.log(err);
    res.status(404).send(err.message);
  }
});

// POST route for adding a post for a user
// 1.request Body consists of text and user
app.post("/post", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const findUser = await User.findById(req.body.user).populate("posts");
    findUser.posts.push(newPost);
    newPost.noOflikes = 0;
    await findUser.save();
    await newPost.save();
    res.send(`post saved for ${findUser.name}`);
  } catch (err) {
    console.log(err);
    res.status(404).send(err.message);
  }
});

// GET route for getting all the posts
app.get("/post", async (req, res) => {
  try {
    const allPosts = await Post.find({}).populate(["likes"]);
    return res.json(allPosts);
  } catch (err) {
    console.log(err);
    res.status(404).send(err.message);
  }
});

// POST route for adding a like for a post
// 1. the request body contains postId and userId
app.post("/like", async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const post = await Post.findById(postId);
    const user = await User.findById(post.user);
    user.averageLikes = (user.averageLikes + 1) / user.posts.length;
    post.noOflikes += 1;
    if (post.noOflikes >= post.user.averageLikes * 5) {
      sendMail(
        "you are famous",
        "congratulations on being famous your post got more than 500 likes",
        user.email
      );
    }
    post.likes.push(userId);
    await post.save();
    await user.save();
    res.send("liked");
  } catch (err) {
    console.log(err);
    res.status(404).send(err.message);
  }
});

// GET route for getting top 10 liked posts
app.get("/famous", async (req, res) => {
  try {
    const allPosts = await Post.find({}).lean();
    allPosts.sort((a, b) => {
      return b.likes.length - a.likes.length;
    });
    const top10 = allPosts.splice(0, Math.min(10, allPosts.length));
    return res.json(top10);
  } catch (err) {
    console.log(err);
    res.status(404).send(err.message);
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
