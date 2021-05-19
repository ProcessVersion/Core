import DiscordClient from '../../Client/Client';
import BaseEvent from '../../Utils/Structures/BaseEvent';
import { Guild } from 'discord.js';
import Schemas from '../../Utils/Schemas';

export default class GuildCreateEvent extends BaseEvent {
	constructor() {
		super('guildCreate');
	}
	async run(client: DiscordClient, guild: Guild) {
		const con = await this.con.connect();
		try {
			await con.query(`BEGIN`);
			await con.query(
				`INSERT INTO Guilds(guildid, welcome, leave, roles, logging, blacklisted, disableditems, moderations, protected, ranks, tags) VALUES('${
					guild.id
				}', '${JSON.stringify(new Schemas.Welcome())}', '${JSON.stringify(
					new Schemas.Leave()
				)}', '${JSON.stringify(new Schemas.Roles())}', '${JSON.stringify(
					new Schemas.Logging()
				)}', '${JSON.stringify(new Schemas.Blacklisted())}', '${JSON.stringify(
					new Schemas.Disabled()
				)}', '${JSON.stringify(new Schemas.Moderations())}', '${JSON.stringify(
					new Schemas.Protected()
				)}', '${JSON.stringify(new Schemas.Ranks())}', '${JSON.stringify(
					new Schemas.Tags()
				)}')`
			);
			await con.query(`COMMIT`);
			console.log('New guild added');
		} catch (error) {
			console.log(error);
		} finally {
			con.release();
		}
	}
}
