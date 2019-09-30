# VK Chat Bot SDK

### Getting started

```

// get secret token for your bot
// https://vk.com/dev/bots_docs?f=1.1.%20Acquiring%20The%20Access%20Token

const vkClient = new ChatBotClient("vk-secret-token");
vkClient.on("message_new", async (vkMessage: VkMessage) => {
    console.log("Message", vkMessage);

    vkClient.reply(vkMessage.user_id, {
        message: "My reply"
    });
});
vkClient.start();

```

### VK keyboard

```
 const keyboard = new Keyboard([
        new ButtonsRow([
            new TextButton("Football", 'positive'),
            new TextButton("Basketball", 'negative'),
            new TextButton("Tennis", 'secondary')
        ]),
        new ButtonsRow([new LocationButton({some: "payload"})]),
    ]).oneTime();
    client.reply("1123441", {
        message: 'Select your sport',
        keyboard: keyboard
    });
```