const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'Mostra todos os comandos disponíveis.',
    async execute(message, args) {
        const commandsPath = path.join(__dirname, '../Commands');
        if (!fs.existsSync(commandsPath)) {
            return message.reply('A pasta de comandos não foi encontrada.');
        }

        const isCreator = message.author.id === 'SEU ID DE CRIADOR PRA VER UMA PASTA OWNER SE FIZER';

        const embedPrincipal = new EmbedBuilder()
            .setColor('#000001')
            .setTitle(' | Comandos Disponíveis')
            .setDescription(' | Selecione uma pasta de comandos para ver mais informações.')
            .setFooter({ text: 'Clique no menu abaixo para navegar.', iconURL: 'https://cdn.discordapp.com/emojis/1233809881602064434.webp?size=80&animated=true' });

        const mainFolders = ['Slash', 'Prefix'];

        const selectMenuOptions = mainFolders.map(folder => {
            const folderPath = path.join(__dirname, '../Commands', folder);
            const subFolders = fs.readdirSync(folderPath)
                .filter(file => fs.statSync(path.join(folderPath, file)).isDirectory() && file !== 'Owner');

            return {
                label: folder,
                value: folder,
                subFolders: subFolders,
            };
        });

        const selectMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('help_select_main_folder')
                .setPlaceholder('Selecione uma opção')
                .addOptions(selectMenuOptions.map(option => ({
                    label: option.label,
                    value: option.value,
                })))
        );

        const closeButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('help_close')
                .setLabel('Fechar')
                .setStyle(ButtonStyle.Danger)
        );

        await message.channel.send({
            embeds: [embedPrincipal],
            components: [selectMenu, closeButton],
        });
    },
};

module.exports.handleSelect = async (interaction, isBack = false) => {
    const { customId, values } = interaction;
    const selectedFolder = values ? values[0] : null;

    if (isBack || customId === 'help_back') {
        const embedPrincipal = new EmbedBuilder()
            .setColor('#000001')
            .setTitle(' | Comandos Disponíveis')
            .setDescription(' | Selecione uma pasta de comandos para ver mais informações.')
            .setFooter({ text: 'Clique no menu abaixo para navegar.', iconURL: 'https://cdn.discordapp.com/emojis/1233809881602064434.webp?size=80&animated=true' });

        const mainFolders = ['Slash', 'Prefix'];

        const selectMenuOptions = mainFolders.map(folder => {
            const folderPath = path.join(__dirname, '../Commands', folder);
            const subFolders = fs.readdirSync(folderPath)
                .filter(file => fs.statSync(path.join(folderPath, file)).isDirectory() && file !== 'Owner');

            return {
                label: folder,
                value: folder,
                subFolders: subFolders,
            };
        });

        const selectMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('help_select_main_folder')
                .setPlaceholder('Selecione uma opção')
                .addOptions(selectMenuOptions.map(option => ({
                    label: option.label,
                    value: option.value,
                })))
        );

        const closeButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('help_close')
                .setLabel('Fechar')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.update({
            embeds: [embedPrincipal],
            components: [selectMenu, closeButton],
        });
    }

    if (customId === 'help_select_main_folder') {
        const selectedMainFolder = selectedFolder;
        const folderPath = path.join(__dirname, '../Commands', selectedMainFolder);

        if (!fs.existsSync(folderPath)) {
            return interaction.reply('Esta pasta de comandos não foi encontrada.');
        }

        const subFolders = fs.readdirSync(folderPath)
            .filter(file => fs.statSync(path.join(folderPath, file)).isDirectory() && file !== 'Owner');

        const selectSubMenuOptions = subFolders.map(folder => ({
            label: folder.charAt(0).toUpperCase() + folder.slice(1),
            value: folder,
        }));

        const selectSubMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('help_select_sub_folder')
                .setPlaceholder('Selecione uma subpasta')
                .addOptions(selectSubMenuOptions)
        );

        const backButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('help_back')
                .setLabel('Voltar')
                .setStyle(ButtonStyle.Secondary)
        );

        const embedUpdated = new EmbedBuilder()
            .setColor('#000001')
            .setTitle(` | Subpastas de: ${selectedMainFolder}`)
            .setDescription('Escolha uma subpasta para ver os comandos disponíveis.')
            .setFooter({ text: 'Clique em uma subpasta para ver seus comandos.', iconURL: 'https://cdn.discordapp.com/emojis/1233809881602064434.webp?size=80&animated=true' });

        await interaction.update({
            embeds: [embedUpdated],
            components: [selectSubMenu, backButton],
        });
    }

    if (customId === 'help_select_sub_folder') {
        const selectedMainFolder = interaction.message.embeds[0].title.split(' | ')[1].split(' ')[2];
        const selectedSubFolder = values[0];
        const folderPath = path.join(__dirname, '../Commands', selectedMainFolder, selectedSubFolder);

        if (!fs.existsSync(folderPath)) {
            return interaction.reply('Esta subpasta de comandos não foi encontrada.');
        }

        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        const commandsList = await Promise.all(commandFiles.map(async (file) => {
            const commandName = file.split('.')[0];
            const command = require(path.join(folderPath, file));

            let description = 'Sem descrição disponível.';
            if (command.data && command.data.description) {
                description = command.data.description;
            } else if (command.description) {
                description = command.description;
            }

            return `**${commandName}**: ${description}`;
        }));

        const commandsListString = commandsList.join('\n') || 'Nenhum comando encontrado nesta pasta.';

        const backButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('help_back')
                .setLabel('Voltar')
                .setStyle(ButtonStyle.Secondary)
        );

        const embedUpdated = new EmbedBuilder()
            .setColor('000001')
            .setTitle(` | Comandos da Subpasta: ${selectedSubFolder}`)
            .setDescription(commandsListString)
            .setFooter({ text: 'Clique em uma pasta para ver seus comandos.', iconURL: 'https://cdn.discordapp.com/emojis/1233809881602064434.webp?size=80&animated=true' });

        await interaction.update({
            embeds: [embedUpdated],
            components: [backButton],
        });
    }
};
