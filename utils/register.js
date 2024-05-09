const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

//-----------------------
const botToken = process.env.DISCORD_TOKEN;
const botID = process.env.BOT_ID;
//-----------------------

const rest = new REST().setToken(botToken);
const slashRegiter = async () => {
  try {
    await rest.put(Routes.applicationCommands(botID), {
      body: [
        new SlashCommandBuilder()
          .setName("tips")
          .setDescription("Get Latest Jito Fee Average")
          .addIntegerOption((option) => {
            return option
              .setName("minutes")
              .setDescription("Tips for last 5,20,30,60 minutes.");
          }),
      ],
    });
    console.log("/tips command Registered ");
  } catch (err) {
    console.error(err);
  }
};
slashRegiter();
