import { App } from '@slack/bolt';
import {EmojiChangedEvent} from '@slack/bolt/dist/types/events';


// ボットトークンと Signing Secret を使ってアプリを初期化
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.event('emoji_changed', async ({ event, client }) => {
  try {
    await client.chat.postMessage({
        channel: process.env.SLACK_CHANNEL_ID || '',
        text: createText(event)
      })
  } catch (error) {
    console.error(error)
  }
});

const createText = (event: EmojiChangedEvent): string => {
  if (event.subtype === 'add') {
    const addedEmoji: string = event.name ?? ''
    return `\`${addedEmoji}\` が追加されました！\n` +
           `:${addedEmoji}:`

  } else if (event.subtype === 'remove') {
    const separator = ' '
    const removedEmojis: string[] = event.names ?? []
    const joined: string = removedEmojis.map((removedEmoji) => `\`${removedEmoji}\``).join(separator)
    return joined + ' が削除されました:sob:'

  } else if (event.subtype === 'rename') {
    return `名前が変更されました \`${event.old_name}\`→\`${event.new_name}\`\n` +
           `:${event.new_name}:`
  }
  return ''
}

(async () => {
  // アプリ起動
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
