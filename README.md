# emoji-notifier
Slackのemoji更新を通知するbot


## How to use
### Command
```sh
# install package
npm install

# build
npm run build

# start app
node dist/app.js

```

### Environment Variables
- `SLACK_BOT_TOKEN` : Bot User OAuth Token
- `SLACK_SIGNING_SECRET` : Signing Secret
- `SLACK_CHANNEL_ID` : Channel to notifiy
