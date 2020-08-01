const sgMail = require("@sendgrid/mail");

const sgAPIKey =
  "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";

sgMail.setApiKey(sgAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "haidren.amalia@gmail.com",
    subject: "Welcome to Task manager app ala Haidoe.",
    text: `
            Welcome to Task Manager App ala Haidoe
            ${name}, hope you'll enjoy our services.
            Let me know how you get along with the app
        `
  });
};

const sendGoodbyeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "haidren.amalia@gmail.com",
    subject: `Goodbye, ${name}`,
    text: `
            Is there something we could have done to prevent you from leaving?
            Let us know, so we can grow.
            Best Regards Task Manager App ala Haidoe.
          `
  });
};

module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail
};
