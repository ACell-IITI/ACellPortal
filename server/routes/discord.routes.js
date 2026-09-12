import express from 'express';
import {
  getServers,
  addServer,
  deleteServer,
  getChannelsByServer,
  addChannel,
  updateChannel,
  deleteChannel,
  bulkDeleteChannels,
  bulkAddChannels,
} from '../controllers/discord.controller.js';

const router = express.Router();

// --- Server Routes ---
router.get('/servers', getServers);
router.post('/servers', addServer);
router.delete('/servers/:id', deleteServer);

// --- Channel Routes ---
router.get('/servers/:serverId/channels', getChannelsByServer);
router.post('/channels', addChannel);
router.put('/channels/:id', updateChannel);
router.delete('/channels/:id', deleteChannel);
router.post('/channels/bulk-delete', bulkDeleteChannels);
router.post('/channels/bulk-add', bulkAddChannels);

export default router;
