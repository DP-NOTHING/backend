const axios = require("axios");
const {User} = require('../db/schema'); // Assuming you have defined the User model
const {Session} = require('../db/schema'); // Assuming you have defined the Session model
const {Transaction} = require('../db/schema'); // Assuming you have defined the Transaction model
const {Invite} = require('../db/schema'); // Assuming you have defined the Invite model

module.exports = {
  /**
   * Start the APIs
   */
  apis: function (app) {
    /**
     * Accept Invite API
     */
    app.post("/api/acceptInvite", async (req, res, next) => {
      if (req && req.body) {
        let email = req.body["email"];
        try {
          const invite = await Invite.findOne({ _id: email });
          if (!invite) {
            return res.status(404).json({ error: "Invite not found" });
          }

          let session_riders = await Session.findOne({ _id: invite.session });
          if (!session_riders) {
            return res.status(404).json({ error: "Session not found" });
          }

          session_riders.riders.push(email);
          await session_riders.save();

          await Invite.deleteOne({ _id: email });

          res.status(200).json(invite);
        } catch (error) {
          console.error("Error accepting invite:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      } else {
        res.status(400).json({ info: "No session specified" });
      }
    });

    /**
     * End Drive API
     */
    app.post("/api/endDrive", async (req, res, next) => {
      if (req && req.body) {
        let session_id = req.body["session_id"];
        try {
          let driver_account = await User.findById(session_id);
          if (!driver_account) {
            return res.status(404).json({ error: "Driver account not found" });
          }

          let mpg = driver_account.car_data.avg_mpg;
          let driver_transactions = driver_account.transactions;
          driver_transactions.push(session_id);

          let session = await Session.findById(session_id);
          if (!session) {
            return res.status(404).json({ error: "Session not found" });
          }

          let { riders, driver } = session;
          let cost = (req.body["total_miles"] / mpg) * 3.95;

          await Transaction.create({
            _id: session_id,
            driver,
            riders,
            cost
          });

          await User.findByIdAndUpdate(session_id, { transactions: driver_transactions });

          for (let i = 0; i < riders.length; i++) {
            let rider = await User.findById(riders[i]);
            if (rider) {
              let { transactions, balance } = rider;
              transactions.push(session_id);
              await User.findByIdAndUpdate(riders[i], { transactions, balance: balance + cost });
            }
          }

          await Session.findByIdAndDelete(session_id);

          res.status(200).json({ info: "Drive ended successfully!" });
        } catch (error) {
          console.error("Error ending drive:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      } else {
        res.status(400).json({ info: "No session specified" });
      }
    });

    /**
     * Update Cost API
     */
    app.post("/api/updateCost", async (req, res, next) => {
      if (req && req.body) {
        let driver_email = req.body["session_id"];
        try {
          let driver = await User.findById(driver_email);
          if (!driver) {
            return res.status(404).json({ error: "Driver not found" });
          }

          let mpg = driver.car_data.avg_mpg;
          // Perform further operations if needed...

          res.status(200).json({ info: "Cost updated successfully!" });
        } catch (error) {
          console.error("Error updating cost:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      } else {
        res.status(400).json({ info: "No session specified" });
      }
    });

    /**
     * Invite Friend API
     */
    app.post("/api/inviteFriend", async (req, res, next) => {
      if (req && req.body) {
        let { friend_email, session } = req.body;
        try {
          await Invite.create({ _id: friend_email, session });
          res.status(200).json({ info: "Invite sent successfully!" });
        } catch (error) {
          console.error("Error sending invite:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      } else {
        res.status(400).json({ info: "No session specified" });
      }
    });

    // Other APIs...

  }
};
