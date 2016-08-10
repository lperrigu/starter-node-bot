// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: lperrigu <marvin@42.fr>                    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2016/08/09 19:11:43 by lperrigu          #+#    #+#             //
//   Updated: 2016/08/10 04:01:42 by lperrigu         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

var Botkit = require('botkit')

var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

controller.hears(['hello', 'hi'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'Hello.')
})

controller.hears(['hello', 'hi'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Hello.')
  bot.reply(message, 'It\'s nice to talk to you directly.')
})

controller.hears(['quiz', '!quiz', '!q'], ['direct_message'],
function (bot, message)
{
		bot.reply(message, 'OK, let\'s make a little quiz')
/*
		askFlavor = function(response, convo)
		{
		convo.ask('What flavor of pizza do you want?', function(response, convo)
			{
				convo.say('Awesome.');
				askSize(response, convo);
				convo.next();
			});
		}
		askSize = function(response, convo)
			{

				convo.ask('What size do you want?', function(response, convo)
				{
					convo.say('Ok.')
					askWhereDeliver(response, convo);
					convo.next();
				});
			}
		askWhereDeliver = function(response, convo)
		{
			convo.ask('So where do you want it delivered?', function(response, convo)
				{
					convo.say('Ok! Good bye.');
					convo.next();
				});
		}
*/
			convo.ask(
				{
				response_type: 'ephemeral',
						attachments: [
							{
							title: 'Do you want to proceed LOL?',
									callback_id: '123',
									attachment_type: 'default',
									actions: [
										{
											"name": "yes",
												"text": "Yes",
												"value": "yes",
												"type": "button",
												},
										{
											"name": "no",
												"text": "No",
												"value": "no",
												"type": "button",
												}
          ]
									}
      ]
				},
				[{
				pattern: 'yes',
						callback: function(response,convo) {
						convo.say('OK you are done!');
						convo.next();
					}
				},
				{
				default: true,
						callback: function(response,convo) {
						// just repeat the question
						convo.repeat();
						convo.next();
					}
				}
					]);
//		bot.startConversation(message, askFlavor);
//				});
/*			bot.startConversation(message, function(err, convo)
				{
					
				}
				)
*/
/*
		bot.reply(message,
				  {
				  attachments:
					[
						{
						  title: 'Do you want to interact with my buttons?',
								  callback_id: '123',
								  attachment_type: 'default',
								  actions:
							  [
								  {
								  "name":"yes",
										  "text": "Yes",
										  "value": "yes",
										  "type": "button",
										  },
								  {
								  "name":"no",
										  "text": "No",
										  "value": "no",
										  "type": "button",
										  }
								  ]
						}
					]
						})
*/
			})

//interactive
//controller.on('interactive_message_callback', function(bot, message) {
//		bot.reply(message,'Je test')
//})

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
				 'direct_message,direct_mention,mention', function(bot, message) {

					 var uptime = formatUptime(process.uptime());

					 bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
							   '>. I have been running for ' + uptime + '.');
				 })

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}

controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'You really do care about me. :heart:')
})

controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'I will respond to the following messages: \n' +
      '`bot hi` for a simple message.\n' +
      '`bot attachment` to see a Slack attachment message.\n' +
      '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
      '`bot help` to see this again.'
  bot.reply(message, help)
})

controller.hears(['attachment'], ['direct_message', 'direct_mention'], function (bot, message) {
  var text = 'Beep Beep Boop is a ridiculously simple hosting platform for your Slackbots.'
  var attachments = [{
    fallback: text,
    pretext: 'We bring bots to life. :sunglasses: :thumbsup:',
    title: 'Host, deploy and share your bot in seconds.',
    image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
    title_link: 'https://beepboophq.com/',
    text: text,
    color: '#7CD197'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp)
  })
})

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand LOLOL. \n')
})
