import { Client, Events, GatewayIntentBits, EmbedBuilder } from "discord.js";
import { averages, getTransactionChance } from "./averages";
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient: any) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("ready", async () => {
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}`);
  }
});

export function startDiscordBot() {
  client.login(token);

  client.on("interactionCreate", async (interaction: any) => {
    if (interaction.isCommand()) {
      if (interaction.commandName === "tips") {
        let minutes = "20m";
        let textRecieved = interaction.options.getInteger("minutes");
        if (textRecieved) {
          if (textRecieved == 5) minutes = "5m";
          else if (textRecieved == 20) minutes = "20m";
          else if (textRecieved == 30) minutes = "30m";
          else if (textRecieved == 60) minutes = "60m";
        } else textRecieved = 20;

        const embed = new EmbedBuilder()
          .setTitle("Jito Tips - Floor Price")
          .setColor("Purple")
          .setDescription("`" + textRecieved + "`" + " minute average ")
          .setTimestamp()
          .addFields(
            {
              name: "25%",
              value:
                "```" + averages[minutes]?.twentyfive.toString() + "```" ??
                "N/A",
              inline: true,
            },
            {
              name: "50%",
              value:
                "```" + averages[minutes]?.fifty.toString() + "```" ?? "N/A",
              inline: true,
            },
            {
              name: "75%",
              value:
                "```" + averages[minutes]?.seventyfive.toString() + "```" ??
                "N/A",
              inline: true,
            },
            {
              name: "95%",
              value:
                "```" + averages[minutes]?.ninetyfive.toString() + "```" ??
                "N/A",
              inline: true,
            },
            {
              name: "99%",
              value:
                "```" + averages[minutes]?.ninetynine.toString() + "```" ??
                "N/A",
              inline: true,
            }
          );

        interaction.reply({ embeds: [embed] });
      } else if (interaction.commandName === "chance") {
        let fee = interaction.options.getNumber("fee");
        let percent = getTransactionChance(fee);

        const embed = new EmbedBuilder()
          .setTitle("Jito: Transaction Sucess Chances")
          .setColor("Purple")
          .setTimestamp();
        if (percent > 26 && percent < 40) embed.setColor("Orange");
        if (percent > 40 && percent < 50) embed.setColor("Yellow");
        if (percent > 50) embed.setColor("Green");
        if (percent < 26) {
          embed.setColor("Red");
          embed.setDescription(
            "There's a less than `" +
              25 +
              "%` chance that your transaction will succeed with `" +
              fee +
              "` Fee."
          );
        } else
          embed.setDescription(
            "There's a `" +
              percent +
              "%` chance that your transaction will succeed with `" +
              fee +
              "` Fee."
          );
        interaction.reply({ embeds: [embed] });
      }
    }
  });
}
