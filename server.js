const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const env = require("dotenv").config();
const path = require("path");
const { connect } = require('./db/connection');
// dotenv.config({ path: '/.env' });
const app = express();
corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// var admin = require("firebase-admin");
// admin.initializeApp({
//   credential: admin.credential.cert({
//     type: process.env.type,
//     projectId: process.env.project_id,
//     private_key_id: process.env.private_key_id,
//     private_key: process.env.private_key,
//     client_email: process.env.client_email,
//     client_id: process.env.client_id,
//     auth_uri: process.env.auth_uri,
//     token_uri: process.env.token_uri,
//     auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
//     client_x509_cert_url: process.env.client_x509_cert_url,
//   }),
//   databaseURL: "https://gasup-c156c-default-rtdb.asia-southeast1.firebasedatabase.app"
// });

// async function decodeIDToken(req, res, next) {
//   if (
//     req &&
//     req.headers &&
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer ")
//   ) {
//     const idToken = req.headers.authorization.split("Bearer ")[1];

//     try {
//       const decodedToken = await admin.auth().verifyIdToken(idToken);
//       console.log(decodedToken);
//       req["currentUser"] = decodedToken;
//     } catch (err) {
//       console.log(err);
//     }
//   }
//   next();
// }

// app.use(decodeIDToken); // for firebase authentication.

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  console.log(process.env.universe_domain);
  next();
});
app.use('check',(req,res)=>{
  res.send('hello');
})
const driveAPIs = require("./apis/SessionApi.js");
const carAPIs = require("./apis/CarApi.js");
const routeAPIs = require("./apis/RouteApi.js");
const signupAPIs = require("./apis/SignUpApi.js");
const profileAPIs = require("./apis/ProfileApi.js");

driveAPIs.apis(app);
carAPIs.apis(app);
routeAPIs.apis(app);
signupAPIs.apis(app);
profileAPIs.apis(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  const connection = await connect();
  console.log(`Server is running on port ${PORT}.`);
});

