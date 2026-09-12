import nodemailer from 'nodemailer';
import EmailQueue from '../models/EmailQueue_model.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    secure: process.env.MAIL_ENCRYPTION === 'ssl', // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

const getNextBackoff = (retryCount) => {
    const now = new Date();
    switch (retryCount) {
        case 0: return new Date(now.getTime() + 1 * 60000); // 1 min
        case 1: return new Date(now.getTime() + 10 * 60000); // 10 mins
        case 2: return new Date(now.getTime() + 60 * 60000); // 1 hr
        case 3: return new Date(now.getTime() + 24 * 60 * 60000); // 24 hrs
        default: return new Date(now.getTime() + 24 * 60 * 60000); // Max backoff 24 hrs
    }
};

const sendInviteEmail = async (task) => {
    const fromName = process.env.MAIL_FROM_NAME || "ACellPortal Discord Bot";
    const fromAddress = process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME;
    
    const mailOptions = {
        from: `"${fromName}" <${fromAddress}>`,
        to: task.recipientEmail,
        subject: `You're invited to ACellPortal Discord as a ${task.role === 'mentor' ? 'Mentor (Admin)' : 'Mentee'}!`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                <h2 style="color: #4f46e5;">Welcome to ACellPortal! 🚀</h2>
                <p>Hello <b>${task.username}</b>,</p>
                <p>You have been assigned to the channel <b>#${task.channelName}</b> as a <b>${task.role}</b>.</p>
                <p>To join your team and unlock your private channels, please click the invite link below. </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${task.inviteLink}" style="background-color: #5865F2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Discord Server</a>
                </div>

                <p style="color: #d97706; font-size: 0.9em; padding: 10px; background: #fffbeb; border-left: 4px solid #f59e0b;">
                    <b>Important:</b> Ensure you join the server using the exact Discord username: <b>${task.username}</b>. Our bot will automatically verify your username and unlock your channels the moment you join!
                </p>
                <br/>
                <p style="color: #64748b; font-size: 0.8em;">If the button doesn't work, copy and paste this link: ${task.inviteLink}</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

export const startEmailDispatcher = () => {
    console.log("📨 Starting Email Dispatcher Queue...");
    
    // Poll every 15 seconds
    setInterval(async () => {
        try {
            // Check if SMTP is configured, else skip to avoid crashing
            if (!process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
                // Silently skip if no creds
                return;
            }

            const pendingTasks = await EmailQueue.find({
                status: 'pending',
                nextRunAt: { $lte: new Date() },
                retryCount: { $lte: 4 } // Stop after 4 retries
            });

            for (const task of pendingTasks) {
                try {
                    console.log(`[EmailQueue] Attempting to send invite to ${task.recipientEmail}...`);
                    await sendInviteEmail(task);
                    
                    task.status = 'sent';
                    await task.save();
                    console.log(`[EmailQueue] ✅ Successfully sent to ${task.recipientEmail}`);
                } catch (err) {
                    console.error(`[EmailQueue] ❌ Failed to send to ${task.recipientEmail}:`, err.message);
                    task.retryCount += 1;
                    task.nextRunAt = getNextBackoff(task.retryCount - 1);
                    task.lastError = err.message;
                    
                    if (task.retryCount > 4) {
                        task.status = 'failed';
                        console.log(`[EmailQueue] Max retries reached for ${task.recipientEmail}. Marked as failed.`);
                    }
                    await task.save();
                }
            }
        } catch (error) {
            console.error("Error in Email Dispatcher:", error);
        }
    }, 15000); // 15 seconds
};
