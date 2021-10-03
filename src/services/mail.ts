import nodemailer from "nodemailer";

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
  repository: Repository
) => {
  const mailOptions = {
    from: `"Docker Update Notifier" <${process.env["SMTP_EMAIL_ADDRESS"]}>`,
    to: `"Docker Update Notifier" <${process.env["SMTP_EMAIL_ADDRESS"]}>`,
    bcc: emails,
    subject: "Update available",
    html: `Update available for ${repository.organization}/${repository.repository}`,
  };

  const res = await transporter.sendMail(mailOptions);
  console.log(res);
};

export { sendUpdateAvailableMail };
