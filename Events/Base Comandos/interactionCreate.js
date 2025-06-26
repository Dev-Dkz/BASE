module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isCommand()) {
      const command = client.slashCommands.get(interaction.commandName);

      if (!command) {
        console.error(`Comando não encontrado: ${interaction.commandName}`);
        return interaction.reply({
          content: "Comando desatualizado.",
          ephemeral: true,
        });
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error("Erro ao executar o comando:", error);
        interaction.reply({ content: "Houve um erro ao executar o comando.", ephemeral: true });
      }
    }
  },
};
