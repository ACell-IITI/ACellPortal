import express from 'express';
import {
  getServers,
  addServer,
  deleteServer,
  getChannelsByServer,
  addChannel,
  deleteChannel,
  bulkDeleteChannels,
  bulkAddChannels,
  addMemberToChannel,
  removeMemberFromChannel,
  updateMemberInChannel,
  fullSync,
} from '../controllers/discord.controller.js';

const router = express.Router();

// --- Server Routes ---
router.get('/servers', getServers);
router.post('/servers', addServer);
router.delete('/servers/:id', deleteServer);

// --- Channel Routes ---
router.get('/servers/:serverId/channels', getChannelsByServer);
router.post('/channels', addChannel);
router.delete('/channels/:id', deleteChannel);
router.post('/channels/bulk-delete', bulkDeleteChannels);
router.post('/channels/bulk-add', bulkAddChannels);

// --- Channel Member Routes ---
router.post('/channels/:channelId/members', addMemberToChannel);
router.put('/channels/:channelId/members/:username', updateMemberInChannel);
router.delete('/channels/:channelId/members/:username', removeMemberFromChannel);

// --- Sync Routes ---
router.post('/sync', fullSync);

export default router;


