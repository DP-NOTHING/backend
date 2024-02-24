const mongoose = require('mongoose');

// Define the schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  first: {
    type: String,
    required: true
  },
  last: {
    type: String,
    required: true
  },
  car_data: {
    avg_mpg: {
      type: Number,
      default: 20
    }
  },
  transactions: {
    type: Array,
    default: []
  },
  friends: {
    type: Array,
    default: []
  },
  balance: {
    type: Number,
    default: 0
  }
});

const InviteSchema = new mongoose.Schema({
    _id: String, // Assuming `friend_email` is used as the document ID
    session: String
  });
  
  const TransactionSchema = new mongoose.Schema({
    _id: String, // Assuming `session_id` is used as the document ID
    driver: String,
    riders: [String], // Assuming `riders` is an array of strings
    cost: Number
  });


// Define the session schema
const sessionSchema = new mongoose.Schema({
  driver: {
    type: String,
    required: true
  },
  coordinates: {
    type: Object, // Assuming GPSLocation is an object containing coordinates
    required: true
  },
  riders: {
    type: [String], // Array of rider emails
    default: []
  },
  cost: {
    type: Number,
    default: 0
  }
});

const carSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  make: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  mpg: {
    type: Number,
    required: true
  }
});

const Car = mongoose.model('Car', carSchema);


// Create the Mongoose model for the session schema
const Session = mongoose.model('Session', sessionSchema);

  
  // Create a model from the schema
  const Transaction = mongoose.model('Transaction', TransactionSchema);
  
  // Create a model from the schema
  const Invite = mongoose.model('Invite', InviteSchema);
  

// Create a model from the schema
const User = mongoose.model('User', UserSchema);

module.exports = {User,Invite,Transaction,Session,Car};
