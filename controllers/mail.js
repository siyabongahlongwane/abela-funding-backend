const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

async function sendMail(req, res) {
    const { type } = req.query || req.body;
    console
    let body = req.body;
    let output = '';
    let subject = '';
    switch (type) {
        case 'email':
            subject = "Contact Form From Website";
            output = generateEmailLayout(body);
            break;
        case 'application':
            subject = `New Application From - ${body.personalDetails.name}`;
            output = generateApplicationLayout(body);
            break;
        default:
            break;
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "mail.webgooru.co.za",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "siyabonga@webgooru.co.za", // generated ethereal user
            pass: "jvPh60sb!", // generated ethereal password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `siyabonga@webgooru.co.za`, // sender address
        to: "hlongwanesiyabonga6@gmail.com", // list of receivers
        subject: subject, // Subject line
        html: output // html body
    });

    if (info.messageId) {
        console.log("Message sent: %s", info.messageId);
        res.send({ msg: "Email sent successfully" });
    } else {
        res.status(500).send({ msg: "Email not sent, try again later." });
    }
}


const generateEmailLayout = (body) => {
    return `
    <h3 style='margin: 0 !important; padding: 5px 0;'>New application received from the website</h3>
    <h3 style='margin: 0 !important; padding: 5px 0;'>Message:</h3>
        <p>${body.message}</a></p>
    <h3 style='margin: 0 !important; padding: 5px 0;'>Contact Details</h3>
    <ul>
        <li style='list-style: none;'> <b>Requestor</b>: ${body.name}</li>
        <li style='list-style: none;'> <b>Email</b>:  ${body.email}</li>
        <li style='list-style: none;'> <b>Phone</b>:  ${body.cellOne}</li>
    </ul>
    </br>
    Warm Regards<br>
    This email was sent from the Abela Trust Website through WEBGOORU PTY LTD's Email Server
    `;
}

const generateStatusUpdateEmailLayout = (body) => {
    return `
    <h3 style='margin: 0 !important; padding: 5px 0;'>Your application status update.</h3>
    <h3 style='margin: 0 !important; padding: 5px 0;'>Message:</h3>
        <p>Hi, your application status has been updated to: ${body.status} </p>
    <h3 style='margin: 0 !important; padding: 5px 0;'>Contact Details</h3>
    <ul>
        <li style='list-style: none;'> <b>Requestor</b>: ${body.name}</li>
        <li style='list-style: none;'> <b>Email</b>:  ${body.email}</li>
        <li style='list-style: none;'> <b>Phone</b>:  ${body.cellOne}</li>
    </ul>
    </br>
    Warm Regards<br>
    This email was sent from the Abela Trust Website through WEBGOORU PTY LTD's Email Server
    `;
}

const generateApplicationLayout = (body) => {
    const reqId = body['_id'];
    return `
    <h3 style='margin: 0 !important; padding: 5px 0;'>New application received from the website</h3>
    <h3 style='margin: 0 !important; padding: 5px 0;'>Requesting For: ${body.personalDetails.requestingFor}</h3>
    <h3 style='margin: 0 !important; padding: 5px 0;'>Requestor Details</h3>
    <ul>
        <li style='list-style: none;'> <b>Requestor</b>: ${body.personalDetails.name}</li>
        <li style='list-style: none;'> <b>Email</b>:  ${body.addressDetails.email}</li>
        <li style='list-style: none;'> <b>Phone</b>:  ${body.addressDetails.cellOne}</li>
    </ul>
    <h3 style='color: #e01a72'>Login and check the request on the Admin Panel. Link: <a style='color: #e01a72; font-weight: bold;' href="http://localhost:4000/abela/admin/applications/view/${reqId}">here</a></h3>
    </br>
    Warm Regards<br>
    This email was sent from the Abela Trust Website through WEBGOORU PTY LTD's Email Server
    `;
}

const logger = () => {
    console.log('Logged req');
}

router.post('/sendEmail', (req, res) => {
    sendMail(req, res);
});

module.exports = {
    logger,
    sendMail,
    router
}
