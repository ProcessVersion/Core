import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class ElephantFactCommand extends BaseCommand {
	constructor() {
		super(
			'elephantfact',
			'facts',
			[],
			'',
			'',
			'',
			[],
			[],
			[],
			[],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const self = this;
		const lang = await this.Translator.Getlang(message.guild.id);
		// Endpoint: https://some-random-api.ml/facts/elephant

		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		} else {
			const generatingEmbed = await this.GeneratingEmbed.SomeRandomApi({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});
			const m = await message.channel.send({ embed: generatingEmbed });
			try {
				const res = await this.Facts.Elephantfact();

				if (res.error == true) {
					m.delete();

					const errEmbed = await this.ErrorEmbed.ApiError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						id: message.guild.id,
					});
					const msg = await message.channel.send({ embed: errEmbed });
					return msg.delete({ timeout: 10000 });
				}

				const factEmbed = await this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Elephantfact command',
					description: `${this.Utils.Capitalize(
						this.Translator.Getstring(lang, 'provided_by')
					)}: \`Some-random-api API\``,
					fields: [{ name: 'Fact:', value: `\`${res.text}\`` }],
				});

				m.delete();
				return message.channel.send({ embed: factEmbed });
			} catch (e) {
				m.delete();
				console.log(e);

				const errorEmbed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
				});
				return message.channel.send({ embed: errorEmbed });
			}
		}
	}
}
