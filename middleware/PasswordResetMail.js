import nodemailer from "nodemailer";

export const sendPasswordResetMail = async (email, userId, token) => {
  const link = `https://  /${userId}/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    to: email,
    from: "jeev.reh@gmail.com",
    text: "Reset Password",
    subject: "Reset your Password",
    text: `CLick on this link to reset password for account ${email}
        ${link}.
        If this is not You, ignore this email.
        Thanks,
        Admin`,
    html: `<h4>Reset your Password</h4><br>
        <p>Hello user, Here is your link to reset password for ${email} account. <marker>Expires in 10 minutes.</marker></p>
        ${link}
        <p> If this is not You, ignore this email.</p>
        <p>Thanks,</p>
        <p>Admin</p>
        `,
  };

  return await transporter.sendMail(mailOptions);
};
