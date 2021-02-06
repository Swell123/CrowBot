const Discord = require("discord.js")
const botconfig = require("../config.json");;
const superagent = require("superagent")
const arraySort = require("array-sort")
const table = require("table")
 
module.exports.run = async (bot, message, args) => {
        message.delete();
 
        let invites = await message.guild.fetchInvites().catch(error => {
            return message.channel.send("Désoler, je n'ai pas la permission de voir les invitations")
        })
 
        invites = invites.array();
 
 
        arraySort(invites, 'uses', { reverse: true})
 
        let possibleInvites = [['Utilisateur', 'Utilisé']]
        invites.forEach(function(invite) {
            possibleInvites.push([invite.inviter.username, invite.uses])
        })
 
        let LeaderEmbed = new Discord.RichEmbed()
        .setColor(colours.green_light)
        .addField("LeaderBoard des invitations", `\`\`\`${table.table(possibleInvites)}\`\`\``)
 
        message.channel.send(LeaderEmbed)
}
 
 
module.exports.help = {
    name: "leaderboard"
} 