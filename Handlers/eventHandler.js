function loadEvents(client) {
  const fs = require("fs");

  
  client.eventHandlers = new Map();  

  const folders = fs.readdirSync("./Events");  


  for (const folder of folders) {
    const files = fs
      .readdirSync(`./Events/${folder}`)
      .filter((file) => file.endsWith(".js")); 


    for (const file of files) {
      const event = require(`../Events/${folder}/${file}`); 


      client.eventHandlers.set(event.name, event);


      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client)); 
      } else {
        client.on(event.name, (...args) => event.execute(...args, client)); 
      }
    }
  }

  console.log("[HANDLER] Todos os eventos carregados.");
}

module.exports = { loadEvents };
