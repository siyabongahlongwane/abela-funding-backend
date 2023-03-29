const mongoose = require('mongoose');

const User = mongoose.model('user', {
    personalDetails: {
        type: Object,
        required: false
    },
    contactDetails: {
        type: Object,
        required: false
    },
    addressDetails: {
        type: Object,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Object,
        required: true
    },
    refId: {
        type: String,
        required: false
    },
    referrer: {
        type:  Object,
        required: false
    },
    referralDate: {
        type: String,
        required: false
    },
    privileges: {
        type: Object,
        required: true
    }
});

module.exports = User;