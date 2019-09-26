import VkResponse from "./VkResponse";

export default class Responder {
    private messages: VkResponse[] = [];
    constructor(executeTimeout: number) {
        setInterval(() => {
            this.flushBuffer();
        }, executeTimeout);
    }

    public reply(userId: string | string[], message: VkResponse) {
        if (Array.isArray(userId) && userId.length > 100) {
            throw new Error('Message can\'t be sent to more than 100 recipients.');
        }
        /*
        const [message, attachment, keyboard, sticker] = args;

        this.execute(
            'messages.send',
            Object.assign(
                Array.isArray(userId)
                    ? { user_ids: userId.join(',') }
                    : { peer_id: userId },
                typeof args[0] === 'object'
                    ? args[0]
                    : {
                        message,
                        attachment: toArray(attachment).join(','),
                        sticker_id: sticker,
                        keyboard: keyboard ? keyboard.toJSON() : undefined,
                    },
            ),
        );


        {
            code: `API.${method}(${JSON.stringify({v: '5.80', ...settings, })})`,
            callback,
  }



        for (let i = 0, j = Math.ceil(methods.length / 25); i < j; i++) {
            const slicedMethods = methods.slice(i * 25, i * 25 + 25);

            api('execute', {
                code: `return [ ${slicedMethods.map(item => item.code)} ];`,
                access_token: this.settings.token,
            })
                .then(({ response, execute_errors = [] }) => {
                    execute_errors.forEach(err => console.error(`Execute Error: ${JSON.stringify(err)}`));
                    response.forEach((body, i) => slicedMethods[i].callback(body));
                })
                .catch(err => console.error(err));
        }
         */
    }

    private flushBuffer() {

    }
}