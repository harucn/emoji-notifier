import { App } from '@slack/bolt';


// ボットトークンと Signing Secret を使ってアプリを初期化
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.event('emoji_changed', async ({ event, client }) => {
  try {
    if(event.subtype === 'add') {
      const addedEmoji : string = event.name ?? ''
      await client.chat.postMessage({
        channel: process.env.SLACK_CHANNEL_ID ?? '',
        text: `emoji added : ${addedEmoji}`
      })
    }

    console.log('Run Success')

  } catch (error) {
    console.error(error)
  }
});


(async () => {
  // アプリ起動
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
