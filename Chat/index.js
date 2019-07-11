var Telegrambot = require ('node-telegram-bot-api');
var token = '871485846:AAEmEl3G8Ib3EmN1hSUwpLIfcfecBGnCmVU';
var bot = new Telegrambot(token, {polling:true});
var myname = "Emmanuel Abaidoo Quainoo";
var request = require('request');


bot.onText(/\mention (.+)/,function(msg, match){
    var chatId1 = msg.chat.id;
    var echo = myname;
    //var echo = match[1];
    //bot.sendMessage(chatId1,name);
    bot.sendMessage(chatId1,echo);
});


bot.onText(/\movie (.+)/, function(msg,match){
    var movie = match[1];
    var chatId = msg.chat.id;
    request(`http://www.omdbapi.com/?apikey=7596c62e&t=${movie}`, function(error,response,body){
        if(!error && response.statusCode==200){
            bot.sendMessage(chatId, '_Give it a few seconds....._', {parse_mode:'Markdown'})
            .then(function(msg){
                var res = JSON.parse(body);
                bot.sendMessage(chatId, 'Result: \n' + res.Title + '\nYear: ' + res.Year + '\nRated: ' + res.Rated + '\nReleased: ' + res.Released + '\nDirector: ' + res.Director + '\nActors: ' + res.Actors + '\n' +res.Poster);
                //bot.sendPhoto(chatId, res.poster,)
            })
        }
    });
});

bot.onText(/\@football (.+)/, function(msg,match){
    var football = match[1];
    var chatId = msg.chat.id;
    request(`https://api.wit.ai/message?v=20190704&q=${football}`, function(error,response,body){
        if(!error && response.statusCode==200){
            bot.sendMessage(chatId, '_Give it a few seconds....._', {parse_mode:'Markdown'})
            .then(function(msg){
               // var res = JSON.parse(body);
                bot.sendMessage(chatId,football);
            })
        }
    });
});

