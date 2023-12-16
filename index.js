require("dotenv").config();
require("axios");
const { Client, IntentsBitField } = require("discord.js");
const { stringify } = require("nodemon/lib/utils");
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],
});

client.on("ready", (c) => {
	console.log(
		"I am online and full of errors, sincerely",
		`${c.user.username}`
	);
});

client.on("guildCreate", async (guild) => {
	guild.commands
		.set(commands)
		.then(() => console.log(`Commands deployed in guild ${guild.name}!`));
});

client.on("messageCreate", async (message) => {
	if (message.author.bot) {
		return;
	}

	if (message.content == "hello") {
		await message.reply(":wave:");
	}
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "hey") {
		return await interaction.reply("hey!");
	}

	if (interaction.commandName === "ping") {
		return await interaction.reply("pong!");
	}

	if (interaction.commandName === "help") {
		const CommandList = await getCommands(commands);
		await interaction.reply(CommandList);

		async function getCommands(commands) {
			StringCommands = "/";
			for (let track = 0; track < commands.length; track++) {
				StringCommands +=
					commands[track].name + (track < commands.length - 1 ? " /" : "");
			}
			return StringCommands;
		}
	}

	if (interaction.commandName === "weather") {
		const axios = require("axios");

		async function fetchWeather() {
			try {
				const response = await axios.get(
					"https://api.open-meteo.com/v1/forecast?latitude=59.92&longitude=5.45&hourly=temperature_2m,precipitation_probability,precipitation&current_weather=true&forecast_days=1&timezone=auto"
				);
				return response.data;
			} catch (error) {
				console.error("Failed to fetch weather data:", error);
				return null;
			}
		}

		async function returnWeather() {
			const weatherData = await fetchWeather();
			if (weatherData) {
				const temperature =
					Math.round(weatherData.current_weather.temperature) + 4.5;
				const windSpeed = weatherData.current_weather.windspeed;
				const responseText = `${temperature} °C, ${windSpeed} km/h`;
				await interaction.reply(responseText);
			} else {
				// Handle the case where the API request fails
				await interaction.reply("Failed to fetch weather data.");
			}
		}

		returnWeather();
	}

	if (interaction.commandName === "random-number") {
		const min = parseInt(interaction.options.getString("min"));
		const max = parseInt(interaction.options.getString("max"));

		if (isNaN(min) || isNaN(max)) {
			// if user inputs no number
			await interaction.reply(
				"Please provide valid values for both min and max."
			);
		}

		// generates random number
		const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

		await interaction.reply(`${randomNumber}`);
	}
});

client.login(process.env.token);

const commands = [
	{
		name: "hey",
		description: "Replies with hey!",
	},
	{
		name: "ping",
		description: "Pong!",
	},
	{
		name: "weather",
		description: "Current temp and wind for Stord",
	},
	{
		name: "coin-flip", // Updated command name
		description: "flips a coin",
	},
	{
		name: "random-number", // Updated command name
		description: "random number min-max",
		options: [
			{
				type: 3,
				name: "min",
				description: "The minimum value",
				required: true,
			},
			{
				type: 3,
				name: "max",
				description: "The maximum value",
				required: true,
			},
		],
	},
	{
		name: "help",
		description: "says all the commands",
	},
];
