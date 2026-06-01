const dns = require("dns");
const nodemailer = require("nodemailer");

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

(async () => {
  try {
    await transporter.verify();
    console.log("SMTP READY (Gmail connected successfully)");
  } catch (error) {
    console.error("SMTP VERIFY FAILED");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Response:", error.response);
  }
})();

const sendLeaveRequestEmail = async ({
  employeeName,
  startDate,
  endDate,
  subject,
  notes,
}) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error(
        "Missing EMAIL_USER or EMAIL_PASS in environment variables"
      );
    }

    const info = await transporter.sendMail({
      from: `Leather Works <${process.env.EMAIL_USER}>`,
      to: process.env.MANAGER_EMAIL,

      subject: "Nouvelle demande de congé",

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Nouvelle demande de congé</h2>

          <p><strong>Employé:</strong> ${employeeName}</p>

          <p><strong>Date de début:</strong> ${new Date(
            startDate
          ).toLocaleDateString("fr-FR")}</p>

          <p><strong>Date de fin:</strong> ${new Date(
            endDate
          ).toLocaleDateString("fr-FR")}</p>

          <p><strong>Motif:</strong> ${subject}</p>

          <p><strong>Notes:</strong> ${notes}</p>

          <p>
            Veuillez vous connecter dans l'application Leather Works pour approuver ou refuser la demande.
          </p>
        </div>
      `,
    });

    console.log(" Email sent successfully:", info.messageId);

    return info;
  } catch (error) {
    console.error(" EMAIL SEND FAILED");

    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Response:", error.response);
    console.error("Command:", error.command);

    throw error;
  }
};

module.exports = sendLeaveRequestEmail;
