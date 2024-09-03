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
          .setDescription(
            "The '/tips' command retrieves the latest Jito fee average for a specified number of minutes."
          )
          .addIntegerOption((option) => {
            return option
              .setName("minutes")
              .setDescription("Tips for last 5,20,30,60 minutes.");
          }),
        new SlashCommandBuilder()
          .setName("chance")
          .setDescription(
            "Calculates the txn success probability or chance  based on a specified Fee."
          )
          .addNumberOption((option) => {
            return option
              .setName("fee")
              .setDescription("Fee Amount e.g 0.002.");
          }),
      ],
    });
    console.log("/chance , /tips command Registered ");
  } catch (err) {
    console.error(err);
  }
};
slashRegiter();
