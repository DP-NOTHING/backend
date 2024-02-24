const express = require('express');
const router = express.Router();
const {User} = require('../db/schema'); // Import Mongoose User model
// const bcrypt = require('bcryptjs');

module.exports = {
  // APIs
  apis: function (app) {
    app.post("/api/signUp", async (req, res, next) => {
      console.log("signup");
      console.log(req.body);
      if (req && req.body) {
        // Get the user information to add to the account
        console.log(req.body);
        let user_email = req.body["email"].toLowerCase();
        let first_name = req.body["firstName"];
        let last_name = req.body["lastName"];

        try {
          // Create a new user document
          const newUser = new User({
            email: user_email,
            first: first_name,
            last: last_name,
            car_data: {
              avg_mpg: 20,
            },
            transactions: [],
            friends: [],
            balance: 0,
          });
          
          // Save the user to MongoDB
          await newUser.save();

          res.status(200).json({ info: `${user_email} created` });
        } catch (error) {
          console.error("Error creating user:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      } else {
        res.status(400).json({ error: "Bad request" });
      }
    });

    app.post("/api/addFriend", async (req, res, next) => {
      if (req && req.body) {
        // Get the user and the friend email
        let friend_email = req.body["friend_email"];
        let user_email = req.body["user_email"];

        try {
          // Find the user by email and update their friends list
          await User.findOneAndUpdate(
            { email: user_email },
            { $push: { friends: friend_email } }
          );

          res.status(200).json({ info: `Friend ${friend_email} added` });
        } catch (error) {
          console.error("Error adding friend:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      } else {
        res.status(400).json({ error: "Bad request" });
      }
    });

    app.post("/api/getFriends", async (req, res, next) => {
      if (req && req.body) {
        // Get the user email
        let email = req.body["email"];

        try {
          // Find the user by email
          const user = await User.findOne({ email });

          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          // Extract friends list
          const friends_list = user.friends;

          let output = [];
          for (let i = 0; i < friends_list.length; i++) {
            let friend_email = friends_list[i];

            // Find friend's details by email
            const friend = await User.findOne({ email: friend_email });

            if (friend) {
              let data = {
                name: friend.first,
                email: friend_email,
              };
              output.push(data);
            }
          }

          res.status(200).json(output);
        } catch (error) {
          console.error("Error getting friends:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      } else {
        res.status(400).json({ error: "Bad request" });
      }
    });
  },
};
