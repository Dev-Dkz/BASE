function loadCommands(client) {
  const fs = require("fs");
  const path = require("path");

  let commandFiles = [];


  const loadFolder = (folderPath) => {
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {

        loadFolder(filePath);
      } else if (file.endsWith(".js")) {

        const command = require(filePath);
        client.commands.set(command.name, command); 

        if (command.data) {
          client.slashCommands.set(command.data.name, command); 
        }
      }
    });
  };


  loadFolder(path.join(__dirname, "../Commands"));

  console.log("[HANDLER] Comandos carregados.");
}

module.exports = { loadCommands };
