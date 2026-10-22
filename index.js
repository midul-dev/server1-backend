import "dotenv/config";
import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ekwx5uj.mongodb.net/`);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectedClient =await connectToMongoDB();
const db = connectedClient.db("server1_users");
const usersCollection = db.collection("users");

app.get("/", (req, res) => {
  res.send("hello server");
});

app.get("/users", async (req, res) => {
  const cursor = usersCollection.find({});
  const users = await cursor.toArray();
  res.send(users);
});

app.post("/users", async (req, res) => {
    const newUser = req.body;
    console.log("adding new user", newUser);
    const result = await usersCollection.insertOne(newUser);
    res.send(result);
})
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
