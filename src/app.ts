import { App } from "@slack/bolt";
import { EmojiChangedEvent } from "@slack/types";

// ボットトークンと Signing Secret を使ってアプリを初期化
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const createText = (event: EmojiChangedEvent) => {
  switch (event.subtype) {
    case "add": {
      const addedEmoji = event.name ?? "";
      return `\`${addedEmoji}\` が追加されました！\n` + `:${addedEmoji}:`;
    }

    case "remove": {
      const separator = " ";
      const removedEmojis = event.names ?? [];
      const joined = removedEmojis
        .map((removedEmoji) => `\`${removedEmoji}\``)
        .join(separator);
      return joined + " が削除されました:sob:";
    }

    case "rename": {
      return (
        `名前が変更されました \`${event.old_name}\`→\`${event.new_name}\`\n` +
        `:${event.new_name}:`
      );
    }

    default: {
      const _check: never = event.subtype;
      throw new Error(`Unknown subtype: ${_check}`);
    }
  }
};

const received = new Set();

app.event("emoji_changed", async ({ event, client, context, body }) => {
  console.log("😁 emoji changed");
  console.log({
    event,
    body,
    slack: {
      retryNum: context.retryNum,
      retryReason: context.retryReason,
    },
  });

  const eventKey = `${event.subtype}:${event.name || ""}`;
  if (received.has(eventKey)) return;
  received.add(eventKey);

  try {
    await client.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID || "",
      text: createText(event),
    });
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  // アプリ起動
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
