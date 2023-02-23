import { client } from "../index.js";
import { ObjectId } from "mongodb";

export async function registerUser(data) {
  return await client.db("ResetApp").collection("UserData").insertOne(data);
}

export async function getUserEmailFromDB(email) {
  return await client
    .db("ResetApp")
    .collection("UserData")
    .findOne({ email: email });
}

export async function getUsernameFromDB(username) {
  return await client
    .db("ResetApp")
    .collection("UserData")
    .findOne({ username: username });
}

export async function getUserIDFromDB(_id) {
  return await client
    .db("ResetApp")
    .collection("UserData")
    .findOne({ _id: ObjectId(_id) });
}

export async function resetPasswordById({ userId, password: hashedPassword }) {
  return await client
    .db("ResetApp")
    .collection("UserData")
    .updateOne(
      { _id: ObjectId(userId) },
      { $set: { password: hashedPassword } }
    );
}
