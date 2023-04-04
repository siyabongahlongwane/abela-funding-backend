const express = require('express');
const router = express.Router();
const User = require('../models/User');

const updateProfile = async (req, res) => {
    const user = await User.findOne(req.params);
    if (user) {
        delete req.body.password;
        await User.findByIdAndUpdate(req.params, { $set: req.body }, { new: true, returnOriginal: false }).then(updatedProfile => {
            try {
                res.send({ msg: "Profile updated successfully", updatedProfile });
            } catch (error) {
                console.log(error);
                res.status(500).send({ msg: "Error updating profile" });
            }
        })
    } else {
        res.status(500).send({ msg: "User not found" });
    }
}

const fetchReferrals = async (req, res) => {
    const query = { referrer: { $exists: true } };
    const projections = { personalDetails: 1, referralDate: 1, referrer: 1 }
    await User.find(query, projections).then(referrals => {
        try {
            if (referrals) {
                res.send(referrals);
            } else {
                res.send({ base64 });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ msg: "Error Fetching Document" })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" })
    })
};

router.put('/updateProfile/:_id', updateProfile);
router.get('/fetchReferrals', fetchReferrals);
module.exports = router;

