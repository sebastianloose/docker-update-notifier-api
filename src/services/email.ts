import nodemailer from "nodemailer";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
  host: process.env["SMTP_HOST"],
  port: parseInt(process.env["SMTP_PORT"] as string) || 587,
  secure: false,
  auth: {
    user: process.env["SMTP_USERNAME"],
    pass: process.env["SMTP_PASSWORD"],
  },
  tls: {
    ciphers: "SSLv3",
  },
});

const sendUpdateAvailableMail = async (
  emails: string[],
  { organization, repository }: Repository
) => {
  const mailBody = await ejs.renderFile(
    __dirname + "/../../templates/updateAvailableEmail.html",
    { organization, repository }
  );
  const mailOptions = {
    from: `"Docker Update Notifier" <${process.env["SMTP_EMAIL_ADDRESS"]}>`,
    to: `"Docker Update Notifier" <${process.env["SMTP_EMAIL_ADDRESS"]}>`,
    bcc: emails,
    subject: "Update available",
    html: mailBody,
  };

  await transporter.sendMail(mailOptions);
};

export { sendUpdateAvailableMail };
