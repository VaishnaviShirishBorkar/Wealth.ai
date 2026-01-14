import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
//      host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // TLS
  service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP ready to send emails");
  }
});

export const sendBudgetExceededEmail = async (to, spent, budget) => {
  try {
    const percent = Math.round((spent / budget) * 100);
    const info = await transporter.sendMail({
      from: `"WealthAI" <borkarvaishnavi45@gmail.com>`,
      to,
      subject: "⚠️ Budget Alert: 90% of Monthly Budget Used",
      html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;">
          
          <h2 style="color: #e11d48;">⚠️ Budget Warning</h2>

          <p>Hello,</p>

          <p>
            This is a friendly reminder from <b>WealthAI</b>.
              You have used <b>${percent}%</b> of your monthly budget.
          </p>

          <table style="width: 100%; margin: 16px 0; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Total Budget</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">₹${budget}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Amount Spent</b></td>
              <td style="padding: 8px; border: 1px solid #ddd; color: #e11d48;">
                ₹${spent}
              </td>
            </tr>
          </table>

          <p>
            🔍 <b>What you can do next:</b>
          </p>

          <ul>
            <li>Pause non-essential expenses</li>
            <li>Review category-wise spending in WealthAI</li>
            <li>Adjust your monthly budget if needed</li>
          </ul>

          <p>
            Staying aware of your spending helps you stay in control of your finances.
            We're here to help you make smarter decisions.
          </p>

          <hr style="margin: 24px 0;" />

          <p style="font-size: 13px; color: #666;">
            This is an automated alert from <b>WealthAI</b>.<br/>
            You’ll receive this alert only once per month.
          </p>

          <p style="font-size: 13px; color: #666;">
            — Team WealthAI 💙
          </p>

        </div>
      `
    });

    console.log("📧 Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
};
