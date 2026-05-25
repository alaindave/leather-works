const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
