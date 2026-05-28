const nodemailer = require("nodemailer");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "74.125.69.108",
  port: 587,
  secure: false,
  requireTLS: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP verify error:", error);
  } else {
    console.log("SMTP server ready", success);
  }
});

const sendLeaveRequestEmail = async ({
  employeeName,
  startDate,
  endDate,
  subject,
  notes,
}) => {
  return await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.MANAGER_EMAIL,
    subject: "Nouvelle demande de congé",

    html: `
      <div style="
        font-family: Arial;
        padding: 20px;
      ">
        <h2>
        Nouvelle demande de congé
        </h2>

        <p>
          <strong>Employé:</strong>
          ${employeeName}
        </p>

        <p>
          <strong>Date de début de congé: </strong>
          ${new Date(startDate).toLocaleDateString("fr-FR")}
        </p>

        <p>
          <strong>Date de fin de congé: </strong>
          ${new Date(endDate).toLocaleDateString("fr-FR")}
        </p>

        <p>
          <strong>Motif:</strong>
          ${subject}
        </p>

        <p>
          <strong>Notes:</strong>
          ${notes}
        </p>
        
        <p>
         Veuillez vous connecter dans l'application Leather Works pour approuver ou refuser la demande.
        </p>
      </div>
    `,
  });
};

module.exports = sendLeaveRequestEmail;
