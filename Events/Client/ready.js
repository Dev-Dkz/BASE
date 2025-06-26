const { ActivityType } = require('discord.js');
const figlet = require('figlet');

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    try {

      const chalkModule = await import('chalk');
      const chalk = chalkModule.default; 


      const slashCommands = client.slashCommands
        .filter((command) => command.data)
        .map((command) => command.data.toJSON());


      await client.application.commands.set(slashCommands);


      const slashCount = slashCommands.length;


      const prefixCount = client.commands.size; 

      console.clear();
      console.log(chalk.cyan(figlet.textSync("Seyek Bot", { horizontalLayout: "default" })));
      
      try {
        
        await client.application.fetch();
        const owner = await client.users.fetch(client.application.owner.id);
        
        const eventCount = client.eventHandlers ? client.eventHandlers.size : 0;

       
        const statusInfo = [
          chalk.yellow("⏰ Iniciado em: ") + chalk.white.bold(new Date().toLocaleString()),
          chalk.green("📦 Comandos de barra carregados: ") + chalk.white.bold(slashCount), 
          chalk.green("🎯 Comandos prefixcarregados: ") + chalk.white.bold(prefixCount),
          chalk.yellow("🌐 Servidores conectados: ") + chalk.white.bold(client.guilds.cache.size),
          chalk.yellow("🆔 ID: ") + chalk.white.bold(client.user.id),
          chalk.green("🎯 Eventos carregados: ") + chalk.white.bold(eventCount),
          chalk.yellow("📛 Nome: ") + chalk.white.bold(client.user.tag),
          chalk.yellow("👑 Dono: ") + chalk.white.bold(owner.tag),
          chalk.green("✅ Tudo ok!")
        ];

        console.log(chalk.magenta("=".repeat(60)));
        statusInfo.forEach(info => console.log(info));
        console.log(chalk.magenta("=".repeat(60)));
        
        console.log(chalk.green("AIN SAFADA TO ONLINE"));

      } catch (error) {
        console.error('Erro ao obter informações do dono:', error);
      };
      
      const configuracoes = [
        { text: "Prefixo gg!", url: "https://twitch.tv/dkz_xd" },
        { text: "Prefixo gg!", url: "https://twitch.tv/dkz_xd" },
        { text: "A melhor comunidade!?", url: "https://twitch.tv/dkz_xd" },
        { text: "Prefixo gg!", url: "https://twitch.tv/dkz_xd" },
        { text: "Prefixo gg!", url: "https://twitch.tv/dkz_xd" },
        { text: "Dkz na parada", url: "https://twitch.tv/dkz_xd" },
        { text: "Prefixo gg!", url: "https://twitch.tv/dkz_xd" },
        { text: "Prefixo gg!", url: "https://twitch.tv/dkz_xd" }
      ];

      let indiceAtual = 0;

      function setActivityWithInterval() {
        setInterval(() => {
          const status = configuracoes[indiceAtual];
          if (status) {
            client.user.setPresence({
              status: 'dnd',
              activities: [{
                name: status.text,
                type: ActivityType.Streaming,
                url: status.url
              }]
            });
          }
          indiceAtual = (indiceAtual + 1) % configuracoes.length;
        }, 120000);
      }

      setActivityWithInterval();

    } catch (error) {
      console.error("Erro ao registrar comandos de barra:", error);
    }
  },
};
