const axios = require("axios");
const {User} = require('../db/schema'); // Assuming you have defined the User model
const {Transaction} = require('../db/schema'); // Assuming you have defined the Transaction model

module.exports = {
  // APIs
  apis: function (app) {
    /**
     * Get transaction data for a user
     */
    app.post("/api/getTransaction", async (req, res, next) => {
      // Ensure that a request body was provided
      if (req && req.body) {
        try {
          const { email } = req.body;

          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          const transactions = await Transaction.find({ _id: { $in: user.transactions } });

          let transactions_list = transactions.map(transaction => ({
            driver: transaction.driver,
            cost: transaction.cost,
          }));

          res.status(200).json(transactions_list);
        } catch (error) {
          console.error("Error fetching transactions:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      } else {
        res.status(400).json({ message: "Request Body Not Provided" });
      }
    });

    /**
     * Get user balance
     */
    app.post("/api/getBalance", async (req, res, next) => {
      if (req && req.body) {
        try {
          const { email } = req.body;

          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          res.status(200).json({ balance: user.balance });
        } catch (error) {
          console.error("Error fetching user balance:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      } else {
        res.status(400).json({ message: "Request Body Not Provided" });
      }
    });
  },
};
