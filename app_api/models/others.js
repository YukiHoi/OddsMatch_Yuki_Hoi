// Get mongoose to work with MongoDB
let mongoose = require('mongoose');

// Simple email validator function
const validateEmail = function(email) {
    // Basic email format check
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};

// Define what a User looks like in our database
let UserSchema = new mongoose.Schema({
    // Each field is required (must be filled in)
    firstName: { 
        type: String, 
        required: [true, 'First name is required'],
        trim: true  // Remove extra spaces
    },
    lastName: { 
        type: String, 
        required: [true, 'Last name is required'],
        trim: true
    },
    // Email must be unique and valid format
    email: { 
        type: String, 
        required: [true, 'Email address is required'],
        unique: true,
        lowercase: true,  // Convert to lowercase
        trim: true,
        validate: [validateEmail, 'Please enter a valid email address']
    },
    phoneNo: { 
        type: String, 
        required: [true, 'Phone number is required'],
        trim: true
    },
    address: { 
        type: String, 
        required: [true, 'Address is required'],
        trim: true
    },
    // We store the hashed (encrypted) password, never the actual password
    passwordHash: { 
        type: String, 
        required: [true, 'Password is required']
    }
});

module.exports = mongoose.model('User', UserSchema);
