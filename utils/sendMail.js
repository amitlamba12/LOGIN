const sgMail = require("@sendgrid/mail");
const { SEND_GRID_API_KEY } = require("../config/sendGridKey");

sgMail.setApiKey(SEND_GRID_API_KEY);

const sendMail = async ({ to, from, subject, html,attachments }) => {
  return sgMail.send({
    to,
    from,
    subject,
    html,
    attachments,
  });
};

module.exports = { sendMail };
