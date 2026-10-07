import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the root of discord_bot
dotenv.config({ path: path.join(__dirname, '../.env') });

// Fallback to server's .env if needed
if (!process.env.MONGODB_LINK && !process.env.MONGO_URI) {
    dotenv.config({ path: path.join(__dirname, '../../server/.env') });
}

export const config = {
    MONGODB_LINK: process.env.MONGODB_LINK || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/acellportal',
    BOT_TOKEN: process.env.BOT_TOKEN,
    PORT: process.env.PORT || 3009,
};
