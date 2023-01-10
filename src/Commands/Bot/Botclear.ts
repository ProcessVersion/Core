import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	Message,
	TextChannel,
	Permissions,
	CommandInteraction,
	PermissionsBitField,
} from 'discord.js';

export default class BotClearCommand extends BaseCommand {
	constructor() {
		super(
			'botclear',
			'bot',
			[],
			'',
			"Clears the bot's messages (must be under 2 weeks old!)",
			'',
			[],
			[],
			['ManageMessages', 'Administrator', 'SendMessages', 'EmbedLinks'],
			['ManageMessages', 'Administrator'],
			true,
			false,
			false,
			10000,
			'debug'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		if (
			!message.member.permissions.has([
				PermissionsBitField.Flags.ManageMessages ||
					PermissionsBitField.Flags.Administrator,
			])
		) {
			const embed = await this.ErrorEmbed.UserPermissions({
				accessor: message,
				text: this,
				perms: ['ManageMessages', 'Administrator'],
			});

			return await message.reply({ embeds: [embed] });
		}

		if (
			!message.guild.members.me.permissions.has([
				PermissionsBitField.Flags.ManageMessages ||
					PermissionsBitField.Flags.Administrator,
			])
		) {
			const embed = await this.ErrorEmbed.ClientPermissions({
				accessor: message,
				text: this,
				perms: ['ManageMessages', 'Administrator'],
			});

			return await message.reply({ embeds: [embed] });
		}

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL(),
				command: this,
				accessor: message,
			});
		}

		const messages = await message.channel.messages.fetch({ limit: 100 });
		const botmessages: Message[] = [];
		messages // @ts-ignore
			.filter((m) => m.author.id == client.user.id)
			.forEach((msg) => {
				botmessages.push(msg);
			});

		try {
			await (message.channel as TextChannel).bulkDelete(botmessages);

			const embed = await this.SuccessEmbed.Base({
				accessor: message,
				text: this,
				success_message: `Successfully cleared \`${botmessages.length}\` message(s)`,
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		} catch (error) {
			console.log(error);

			const embed = await this.ErrorEmbed.UnexpectedError({
				accessor: message,
				text: this,
				id: message.guild.id,
			});

			return message.channel.send({ embeds: [embed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
