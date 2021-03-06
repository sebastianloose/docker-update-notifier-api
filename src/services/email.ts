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

const getEmailBody = async (
  fileName: String,
  params: {
    [key: string]: any;
  }
) => {
  const content = await ejs.renderFile(
    __dirname + `/../../templates/${fileName}`,
    params
  );
  const body = await ejs.renderFile(
    __dirname + `/../../templates/emailFrame.html`,
    {
      content,
    }
  );
  return body;
};

const sendUpdateAvailableEmail = async (
  emails: string[],
  { organization, repository }: Repository
) => {
  const mailBody = await getEmailBody("updateAvailableEmail.html", {
    name: `${organization}/${repository}`,
    link: `https://hub.docker.com/r/${organization}/${repository}`,
  });
  const mailOptions = {
    from: `"Docker Update Notifier" <${process.env["SMTP_EMAIL_ADDRESS"]}>`,
    to: `"Docker Update Notifier" <${process.env["SMTP_EMAIL_ADDRESS"]}>`,
    bcc: emails,
    subject: "Update available",
    html: mailBody,
  };

  await transporter.sendMail(mailOptions);
};

const sendVerificationEmail = async (email: string, uuid: string) => {
  const link = `https://api.docker-notifier.sebastianloose.de/verify/${uuid}`;
  const mailBody = await getEmailBody("verifyEmail.html", { link });
  const mailOptions = {
    from: `"Docker Update Notifier" <${process.env["SMTP_EMAIL_ADDRESS"]}>`,
    to: email,
    subject: "Verify your Email",
    html: mailBody,
  };

  await transporter.sendMail(mailOptions);
};

const sendLoginEmail = async (email: string, token: string) => {
  const link = `https://sebastianloose.de/docker-update-notifier/login/?token=${token}`;
  const mailBody = await getEmailBody("loginEmail.html", { link });
  const mailOptions = {
    from: `"Docker Update Notifier" <${process.env["SMTP_EMAIL_ADDRESS"]}>`,
    to: email,
    subject: "Your Login Link",
    html: mailBody,
  };
  await transporter.sendMail(mailOptions);
};

export { sendUpdateAvailableEmail, sendVerificationEmail, sendLoginEmail };
