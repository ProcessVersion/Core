import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class PingCommand extends BaseCommand {
	constructor() {
		super(
			'ping',
			'bot',
			[],
			'',
			"Sends the bot's ping",
			'',
			[],
			[],
			['SendMessages', 'EmbedLinks'],
			[],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL(),
				command: this,
				accessor: message,
			});
		}

		const embed = await this.Embed.Base({
			accessor: message,
			text: this,
			title: `${client.user.tag} ping`,
			description: '`Pinging...`',
		});

		const m = await message.channel.send({ embeds: [embed] });

		const ping = m.createdTimestamp - message.createdTimestamp;

		const newEmbed = this.Embed.Base({
			accessor: message,
			text: this,
			title: `Ping command`,
			description: `${client.user.tag} ping`,
			fields: [
				{ name: 'Latency', value: `\`${ping}\`` },
				{ name: 'Websocket ping', value: `\`${client.ws.ping}\`` },
			],
		});

		return m.edit({ embeds: [newEmbed] });
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		await interaction.deferReply();

		const embed = await this.Embed.Base({
			accessor: interaction,
			text: this,
			title: `${client.user.tag} ping`,
			description: '`Pinging...`',
		});

		const m = await interaction.channel.send({ embeds: [embed] });

		const ping = m.createdTimestamp - interaction.createdTimestamp;

		const newEmbed = this.Embed.Base({
			accessor: interaction,
			text: this,
			title: `Ping command`,
			description: `${client.user.tag} ping`,
			fields: [
				{ name: 'Latency', value: `\`${ping}\`` },
				{ name: 'Websocket ping', value: `\`${client.ws.ping}\`` },
			],
		});

		await m.delete();
		return interaction.editReply({ embeds: [newEmbed] });
	}
}
