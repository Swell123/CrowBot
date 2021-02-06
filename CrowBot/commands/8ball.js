const Discord = require('discord.js'),
    replies = ['Oui', 'Non', 'Peut être', 'Evidemment', 'Suremenent pas','Apparemment']
 
module.exports = {
    run: (message, args) => {
        const question = args.join(' ')
        if (!question) return message.channel.send('Veuillez indiquer une question.')
        message.channel.send(new Discord.MessageEmbed()
            .setTitle(question)
            .setDescription(replies[Math.floor(Math.random() * replies.length)]))
    },
    name: '8ball'
}