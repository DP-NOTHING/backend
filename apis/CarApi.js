const axios = require("axios");
const {Car} = require('../db/schema'); // Assuming you have defined the Car model
const {User} = require('../db/schema'); // Assuming you have defined the User model

module.exports = {
  // APIs
  apis: function (app) {
    /**
     * Endpoint for getting a list of available trims of a make,model, and year
     */
    app.post("/api/findCar", async (req, res, next) => {
      if (req && req.body) {
        // Get year, make, and model from the request
        let make = req.body["make"];
        let year = req.body["year"];
        let model = req.body["model"];

        try {
          // Get the trim data for the requested car
          const resp = await axios.get(
            `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${model}`,
            {
              headers: {
                accept: "application/json",
              },
            }
          );
          // Ensure that the request was successful
          if (resp && resp.data) {
            let vehicle_data = resp.data;
            res.status(200).json({
              make: make,
              year: year,
              model: model,
              id: vehicle_data["menuItem"][0]["value"],
            });
          } else {
            res.status(400).json({ error: "Bad Response From Fueleconomy Api" });
          }
        } catch (error) {
          console.error("Error from fueleconomy api:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      } else {
        res.status(400).json({ error: "No Request Body specified" });
      }
    });

    /**
     * Endpoint for getting info about a certain car given an id
     */
    app.post("/api/addCar", async (req, res, next) => {
      if (req && req.body) {
        // Get the car data from the request
        let { id, make, year, model, email } = req.body;

        try {
          // Get the car info from the FuelEconomy API
          const resp = await axios.get(
            `https://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/${id}`,
            {
              headers: {
                accept: "application/json",
              },
            }
          );

          // Ensure that the response was retrieved
          if (resp && resp.data) {
            // Create a new car document
            const newCar = new Car({
              id: id,
              make: make,
              year: year,
              model: model,
              mpg: resp.data["avgMpg"],
            });

            // Save the car to MongoDB
            await newCar.save();

            // Find the user by email and update their car data
            await User.findOneAndUpdate(
              { email: email },
              { car_data: newCar._id }
            );

            res.status(200).json({ info: "Car info updated" });
          } else {
            res.status(400).json({ error: "Bad response from FuelEconomy Api" });
          }
        } catch (error) {
          console.error("Error from fueleconomy api:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      } else {
        res.status(400).json({ error: "No Request Body specified" });
      }
    });
  },
};
