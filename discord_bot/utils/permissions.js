import { PermissionsBitField, OverwriteType } from 'discord.js';

// ==========================================
// PERMISSIONS BUILDER
// ==========================================
export function buildPermissionOverwrites(guild, members, botId) {
    const permissionOverwrites = [
        {
            id: guild.roles.everyone.id,
            type: OverwriteType.Role,
            deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
            id: botId,
            type: OverwriteType.Member,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles],
        }
    ];

    for (const member of members) {
        // Validate Discord Snowflake format (17-20 digits)
        const isValidSnowflake = /^\d{17,20}$/.test(member.userId);

        if (member.userId && isValidSnowflake) {
            const isMentor = member.role === 'mentor';
            const allowFlags = [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages];

            if (isMentor) {
                allowFlags.push(PermissionsBitField.Flags.ManageChannels);
                allowFlags.push(PermissionsBitField.Flags.ManageMessages);
            }

            permissionOverwrites.push({
                id: member.userId,
                type: OverwriteType.Member,
                allow: allowFlags,
            });
        } else if (member.userId) {
            console.log(`⚠️ Skipping invalid User ID format: "${member.userId}" for ${member.username || 'unknown user'}`);
        }
    }
    return permissionOverwrites;
}
