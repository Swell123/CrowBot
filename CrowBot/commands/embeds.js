const Discord = require('discord.js')
 
module.exports = {
    run: message => {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('Mon titre')
            .setTitle('Autre titre **bonjour**')
            .setDescription('[Recherche Google](https://google.fr) **bonjour**')
            .setColor('RANDOM')
            .addField('Champ 1 **bonjour**', 'Bonjour c\'est moi **bonjour**', true)
            .addField('Champ 2', 'Blabla', true)
            .setAuthor('ala89 **bonjour**', 'https://cdn.discordapp.com/attachments/718476721418141728/719563110154764298/logo.png', 'https://google.fr')
            .setImage('https://cdn.discordapp.com/attachments/718476721418141728/719563122960236644/thumb.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/718476721418141728/719563110154764298/logo.png')
            .setFooter('Mon bot perso **bonjour**', 'https://cdn.discordapp.com/attachments/718476721418141728/719563110154764298/logo.png')
            .setTimestamp()
            .setURL('https://google.fr'))
    },
    name: 'embed',
    help: {
        description: 'Creer un embed'
    }
}