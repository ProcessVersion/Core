import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	AwaitMessagesOptions,
	CommandInteraction,
	Message,
	AttachmentBuilder,
} from 'discord.js';
import { Ad } from 'discord-image-generation';

export default class AdCommand extends BaseCommand {
	constructor() {
		super(
			'ad',
			'canvas',
			[],
			'(@mention || me || help)',
			'',
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
		const guild = client.database.get(message.guild.id);

		const provider = 'Provided by: `Discord IG`';

		const mention = message.mentions.members.first();

		const gEmbed = await this.GeneratingEmbed.DiscordIG({
			iconURL: message.author.displayAvatarURL(),
			id: message.guild.id,
			text: this,
		});

		if (mention) {
			const m = await message.channel.send({ embeds: [gEmbed] });

			try {
				const avatar = mention.user.displayAvatarURL({ forceStatic: true });
				const image = await new Ad().getImage(avatar);
				const file = new AttachmentBuilder(image, { name: 'ad.png' });

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL(),
					text: this,
					title: 'Ad command',
					description: provider,
					image: 'attachment://ad.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embeds: [embed] });
			} catch (error) {
				console.log(error);

				m.delete();
				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL(),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embeds: [embed] });
			}
		}

		if (args[0] && args[0].toLowerCase().includes('help')) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL(),
				command: this,
				accessor: message,
			});
		}
		if (args[0] && args[0].toLowerCase().includes('me')) {
			const m = await message.channel.send({ embeds: [gEmbed] });

			try {
				const avatar = message.author.displayAvatarURL({ format: 'png' });
				const image = await new Ad().getImage(avatar);
				const file = new MessageAttachment(image, 'ad.png');

				const embed = await this.ImageEmbed.Base({
					accessor: message,
					text: this,
					title: 'Ad command',
					description: provider,
					image: 'attachment://ad.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embeds: [embed] });
			} catch (error) {
				m.delete();

				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL(),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embeds: [embed] });
			}
		}

		if (message.attachments.size > 0) {
			const m = await message.channel.send({ embeds: [gEmbed] });

			try {
				const avatar = message.attachments.first().url;
				const image = await new Ad().getImage(avatar);
				const file = new MessageAttachment(image, 'ad.png');

				const embed = await this.ImageEmbed.Base({
					accessor: message,
					text: this,
					title: 'Ad command',
					description: 'Provided by: `Discord IG`',
					image: 'attachment://ad.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embeds: [embed] });
			} catch (error) {
				m.delete();
				const embed = await this.ErrorEmbed.UnexpectedError({
					accessor: message,
					text: this,
				});

				return message.channel.send({ embeds: [embed] });
			}
		}

		let timedOut: boolean = false;

		const options: AwaitMessagesOptions = {
			filter: (m) => m.author.id == message.author.id,
			max: 1,
			time: 60000,
		};

		const tEmbed = await this.Embed.Base({
			accessor: message,
			text: this,
			title: 'Ad command',
			description: `Please send the first image you want.`,
		});

		await message.channel.send({ embeds: [tEmbed] });

		const firstColl = await message.channel.awaitMessages(options);

		if (firstColl.size == 0) timedOut = true;

		if (timedOut == false && firstColl.first()?.content == 'cancel') {
			const embed = await this.SuccessEmbed.Base({
				accessor: message,
				text: this,
				success_message: 'Successfully cancelled selection',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}

		if (firstColl.first().attachments.size == 0) timedOut = true;

		if (timedOut == false && firstColl.first().attachments.size > 0) {
			const m = await message.channel.send({ embeds: [gEmbed] });

			try {
				const avatar = firstColl.first().attachments.first().url;
				const image = await new Ad().getImage(avatar);
				const file = new MessageAttachment(image, 'ad.png');

				const embed = await this.ImageEmbed.Base({
					accessor: message,
					text: this,
					title: 'Ad command',
					description: provider,
					image: 'attachment://ad.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embeds: [embed] });
			} catch (error) {}
		}

		if (timedOut == true) {
			const embed = await this.SuccessEmbed.Base({
				accessor: message,
				text: this,
				success_message: 'Successfully cancelled selection',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
