// Dependencies
const { Embed } = require('../../utils'),
	Command = require('../../structures/Command.js');

module.exports = class Back extends Command {
	constructor(bot) {
		super(bot, {
			name: 'volume',
			dirname: __dirname,
			aliases: ['vol'],
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Changes the volume of the song',
			usage: 'volume <Number>',
			cooldown: 3000,
			examples: ['volume 50'],
		});
	}

	// Run command
	async run(bot, message, settings) {
		// Check if the member has role to interact with music plugin
		if (message.guild.roles.cache.get(settings.MusicDJRole)) {
			if (!message.member.roles.cache.has(settings.MusicDJRole)) {
				return message.channel.error('misc:MISSING_ROLE').then(m => m.timedDelete({ timeout: 10000 }));
			}
		}

		// Check that a song is being played
		const player = bot.manager.players.get(message.guild.id);
		if (!player) return message.channel.error('misc:NO_QUEUE').then(m => m.timedDelete({ timeout: 10000 }));

		// Check that user is in the same voice channel
		if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.error('misc:NOT_VOICE').then(m => m.timedDelete({ timeout: 10000 }));

		// Make sure a number was entered
		if (!message.args[0]) {
			const embed = new Embed(bot, message.guild)
				.setColor(message.member.displayHexColor)
				.setDescription(message.translate('music/volume:CURRENT', { NUM: player.volume }));
			return message.channel.send(embed);
		}

		// make sure the number was between 0 and 1000
		if (Number(message.args[0]) <= 0 || Number(message.args[0]) > 1000) return message.channel.error('music/volume:TOO_HIGH');

		// Update volume
		player.setVolume(Number(message.args));
		const embed = new Embed(bot, message.guild)
			.setColor(message.member.displayHexColor)
			.setDescription(message.translate('music/volume:UPDATED', { NUM: player.volume }));
		return message.channel.send(embed);
	}
};
