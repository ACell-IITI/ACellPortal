import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = [
  {
    ChannelName: 'Team Alpha',
    UserID1: '123456789012345678',
    UserName1: 'Alice',
    UserID2: '234567890123456789',
    UserName2: 'Bob',
    UserID3: '345678901234567890',
    UserName3: 'Charlie',
    UserID4: '456789012345678901',
    UserName4: 'David'
  }
];

const ws = xlsx.utils.json_to_sheet(data);
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, 'Channels');

const publicPath = path.join(__dirname, '../client/public');
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

xlsx.writeFile(wb, path.join(publicPath, 'Discord_Channels_Template.xlsx'));
console.log('Template created successfully!');
