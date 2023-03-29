const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
let mailFunctions = require('./mail');
const makeRequest = async (req, res) => {
    await Application.create(req.body).then(application => {
        if (application) {
            req.body['_id'] = application['_id'].toString().split("(")[0];
            mailFunctions.sendMail(req, res);
            res.status(200).send({ msg: "Application Submitted Successfully" });
        } else {
            res.status(500).send({ msg: "Error Submitting Application, Try Again Later" });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    })
}

const fetchApplications = async (req, res) => {
    const query = req.query;
    const { type } = req.query;
    delete req.query.type;
    let cardCounts = [];
    const temp = {
        all: 0,
        pending: 0,
        inReview: 0,
        approved: 0,
        rejected: 0
    }
    await Application.find(query, type == '-personalDetails.marksDoc').then(applications => {
        try {
            if (type == 'dashboard') {
                temp['all'] = applications.length;
                applications.forEach(application => {
                    switch (application.status.current) {
                        case 'Pending':
                            temp['pending']++
                            break;
                        case 'Approved':
                            temp['approved']++
                            break;
                        case 'In Review':
                            temp['inReview']++
                            break;
                        case 'Rejected':
                            temp['rejected']++
                            break;
                        default:
                            break;
                    }
                });
                cardCounts = Object.values(temp);
                res.send(cardCounts);
            } else {
                res.send(applications);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ msg: "Error Fetching Record(s)" })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" })
    })
}

const fetchMarksDoc = async (req, res) => {
    const query = req.query;
    console.log(query);
    await Application.findOne(query, 'personalDetails.marksDoc.base64').then(doc => {
        try {
            let base64 = doc?.personalDetails?.marksDoc?.base64
            if (!doc?.personalDetails) {
                res.send(null);
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

const deleteApplication = async (req, res) => {
    await Application.deleteOne({ _id: req.params.id }).then((deletedApplication) => {
        if (deletedApplication) res.status(200).send({ msg: `Application ${req.params.id} has been Deleted` });
        else res.status(404).send({ msg: "Error Deleting Application" });
    }).catch(err => {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    })
}

const updateStatus = async (req, res) => {
    const filter = { _id: req.params.id };
    const update = { status: req.body };

    await Application.findOneAndUpdate(filter, { $set: update }, { new: true, returnOriginal: false }).then((updatedDoc) => {
        console.log(updatedDoc);
        try {
            if (updatedDoc) {
                updatedDoc['type'] = 'statusUpdate';
                mailFunctions.sendMail(updatedDoc, res);
                res.status(200).send({ msg: "Status Updated Successfully" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).send({ msg: "Internal Server Error" });
        }
    })
}

router.post('/new', makeRequest);
router.get('/fetchApplications', fetchApplications);
router.get('/fetchMarksDocument', fetchMarksDoc);
router.delete('/deleteApplication/:id', deleteApplication);
router.put('/update/:id', updateStatus);
module.exports = router;

