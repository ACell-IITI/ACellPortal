import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Plus, Trash2, Upload, ExternalLink, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../api/alumni";

const DiscordPanel = () => {
  const [servers, setServers] = useState([]);
  const [selectedServerId, setSelectedServerId] = useState("");
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  
  // Modals state
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  
  // Form states
  const [serverForm, setServerForm] = useState({ serverName: "", serverId: "", description: "" });
  const [channelForm, setChannelForm] = useState({ channelName: "", members: [] });
  
  const fileInputRef = useRef(null);

  // Fetch all servers on load
  useEffect(() => {
    fetchServers();
  }, []);

  // Fetch channels when server is selected
  useEffect(() => {
    if (selectedServerId) {
      fetchChannels();
    } else {
      setChannels([]);
      setSelectedChannels([]);
    }
  }, [selectedServerId]);

  const fetchServers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/discord/servers`);
      setServers(res.data.data);
      if (res.data.data.length > 0 && !selectedServerId) {
        setSelectedServerId(res.data.data[0]._id);
      }
    } catch (err) {
      console.error("Error fetching servers", err);
    }
  };

  const fetchChannels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/discord/servers/${selectedServerId}/channels`);
      setChannels(res.data.data);
      setSelectedChannels([]);
    } catch (err) {
      console.error("Error fetching channels", err);
    }
  };

  const handleAddServer = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/admin/discord/servers`, serverForm);
      alert("Server added successfully!");
      setServerForm({ serverName: "", serverId: "", description: "" });
      setIsServerModalOpen(false);
      fetchServers();
    } catch (err) {
      console.error("Error adding server", err);
      alert(err.response?.data?.message || "Failed to add server");
    }
  };

  const handleDeleteServer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this server?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/discord/servers/${id}`);
      if (selectedServerId === id) setSelectedServerId("");
      fetchServers();
    } catch (err) {
      console.error("Error deleting server", err);
    }
  };

  const handleAddChannel = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/admin/discord/channels`, {
        serverId: selectedServerId,
        channelName: channelForm.channelName,
        members: channelForm.members,
      });
      alert("Channel added successfully!");
      setChannelForm({ channelName: "", members: [] });
      setIsChannelModalOpen(false);
      fetchChannels();
    } catch (err) {
      console.error("Error adding channel", err);
      alert("Failed to add channel");
    }
  };

  const handleDeleteChannel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this channel?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/discord/channels/${id}`);
      fetchChannels();
    } catch (err) {
      console.error("Error deleting channel", err);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedChannels.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedChannels.length} selected channels?`)) return;

    try {
      await axios.post(`${API_BASE_URL}/api/admin/discord/channels/bulk-delete`, {
        channelIds: selectedChannels
      });
      fetchChannels();
    } catch (err) {
      console.error("Error bulk deleting channels", err);
      alert("Failed to delete selected channels");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);
        
        if (rows.length === 0) {
          alert("Excel file is empty.");
          return;
        }

        const channelsToInsert = [];
        for (const row of rows) {
          const channelName = row['ChannelName'] || '';
          const members = [];
          
          for (let i = 1; i <= 20; i++) {
            const userId = row[`UserID${i}`] || row[`UserId${i}`] || row[`userid${i}`];
            const username = row[`UserName${i}`] || row[`Username${i}`] || row[`username${i}`];
            
            if (userId) {
              members.push({
                userId: String(userId),
                username: username ? String(username) : '',
              });
            }
          }

          channelsToInsert.push({ channelName, members });
        }

        await axios.post(`${API_BASE_URL}/api/admin/discord/channels/bulk-add`, {
          serverId: selectedServerId,
          channels: channelsToInsert
        });
        
        alert("Channels uploaded successfully!");
        fileInputRef.current.value = "";
        fetchChannels();
      } catch (err) {
        console.error("Error parsing or uploading file", err);
        alert("Failed to upload channels");
      }
    };
    reader.readAsBinaryString(file);
  };

  const toggleChannelSelection = (id) => {
    if (selectedChannels.includes(id)) {
      setSelectedChannels(selectedChannels.filter(cId => cId !== id));
    } else {
      setSelectedChannels([...selectedChannels, id]);
    }
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...channelForm.members];
    newMembers[index][field] = value;
    setChannelForm({ ...channelForm, members: newMembers });
  };

  const addMemberField = () => {
    setChannelForm({ ...channelForm, members: [...channelForm.members, { userId: "", username: "" }] });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Discord Server Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage discord servers, channels, and member mappings.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedServerId} 
            onChange={(e) => setSelectedServerId(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg text-slate-700 bg-white"
          >
            <option value="" disabled>Select a Server</option>
            {servers.map(server => (
              <option key={server._id} value={server._id}>{server.serverName}</option>
            ))}
          </select>
          <button 
            onClick={() => setIsServerModalOpen(true)}
            className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            title="Manage Servers"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsChannelModalOpen(true)}
              disabled={!selectedServerId}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${selectedServerId ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
            >
              <Plus size={18} />
              Add Channel
            </button>
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={!selectedServerId}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${selectedServerId ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
            >
              <Upload size={18} />
              Bulk Upload (Excel)
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
            />
            <a 
              href="/Discord_Channels_Template.xlsx" 
              download
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm"
            >
              <Download size={16} />
              Template
            </a>
          </div>
          
          {selectedChannels.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors font-medium"
            >
              <Trash2 size={18} />
              Delete Selected ({selectedChannels.length})
            </button>
          )}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-sm">
              <tr>
                <th className="p-4 w-12">
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) setSelectedChannels(channels.map(c => c._id));
                      else setSelectedChannels([]);
                    }}
                    checked={channels.length > 0 && selectedChannels.length === channels.length}
                  />
                </th>
                <th className="p-4 font-semibold">Channel Name</th>
                <th className="p-4 font-semibold">Members</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!selectedServerId ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    Please select a server to view channels.
                  </td>
                </tr>
              ) : channels.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    No channels found for this server.
                  </td>
                </tr>
              ) : (
                channels.map((channel) => (
                  <tr key={channel._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        checked={selectedChannels.includes(channel._id)}
                        onChange={() => toggleChannelSelection(channel._id)}
                      />
                    </td>
                    <td className="p-4 font-medium text-slate-800">
                      {channel.channelName || <span className="text-slate-400 italic">Unnamed</span>}
                    </td>
                    <td className="p-4">
                      {channel.members.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {channel.members.map((member, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">
                              {member.username || member.userId}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">No members mapped</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteChannel(channel._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Server Modal */}
      {isServerModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Manage Discord Servers</h3>
              <button onClick={() => setIsServerModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <div className="p-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Existing Servers</h4>
              <ul className="space-y-2 mb-6 max-h-40 overflow-y-auto">
                {servers.map(server => (
                  <li key={server._id} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-sm font-medium">{server.serverName}</span>
                    <button onClick={() => handleDeleteServer(server._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                  </li>
                ))}
                {servers.length === 0 && <p className="text-sm text-slate-500">No servers added yet.</p>}
              </ul>

              <h4 className="text-sm font-semibold text-slate-700 mb-3">Add New Server</h4>
              <form onSubmit={handleAddServer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Server Name</label>
                  <input type="text" required value={serverForm.serverName} onChange={e => setServerForm({...serverForm, serverName: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. ACell Main" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Server ID</label>
                  <input type="text" required value={serverForm.serverId} onChange={e => setServerForm({...serverForm, serverId: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="1234567890..." />
                </div>
                <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">Add Server</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Channel Modal */}
      {isChannelModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-slate-800">Add Discord Channel</h3>
              <button onClick={() => setIsChannelModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto grow">
              <form id="add-channel-form" onSubmit={handleAddChannel} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Channel Name (Optional)</label>
                  <input type="text" value={channelForm.channelName} onChange={e => setChannelForm({...channelForm, channelName: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Team Alpha" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">Members Map</label>
                    <button type="button" onClick={addMemberField} className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                      <Plus size={14} /> Add Member
                    </button>
                  </div>
                  
                  {channelForm.members.map((member, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        required
                        value={member.userId} 
                        onChange={e => handleMemberChange(i, 'userId', e.target.value)} 
                        className="w-1/2 p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                        placeholder="User ID *" 
                      />
                      <input 
                        type="text" 
                        value={member.username} 
                        onChange={e => handleMemberChange(i, 'username', e.target.value)} 
                        className="w-1/2 p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                        placeholder="Username (Opt)" 
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const nm = [...channelForm.members];
                          nm.splice(i, 1);
                          setChannelForm({...channelForm, members: nm});
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {channelForm.members.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No members mapped. Click "Add Member" to map users.</p>
                  )}
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsChannelModalOpen(false)} className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50">Cancel</button>
              <button form="add-channel-form" type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Channel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DiscordPanel;
