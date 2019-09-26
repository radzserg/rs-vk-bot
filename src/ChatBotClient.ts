import UpdatesListener from "./updates/UpdatesListener";
import UpdatesHandler from "./updates/UpdatesHandler";
import VkApi from "./api/VkApi";
import VkResponse from "./responses/VkResponse";
import Responder from "./responses/Responder";

interface IChatBotClientSettings {
    pollingTimeout: number;
    executeTimeout: number;
}

export default class ChatBotClient {
    private readonly settings: IChatBotClientSettings = {
        pollingTimeout: 25,
        executeTimeout: 50,
    };
    private updatesHandler: UpdatesHandler;
    private readonly vkApi: VkApi;
    private responder: Responder;

    constructor(token: string, settings?: IChatBotClientSettings) {
        this.settings = {
            ...this.settings,
            ...settings,
        };
        this.vkApi = new VkApi(token);

        this.updatesHandler = new UpdatesHandler();
        this.responder = new Responder(this.settings.executeTimeout);
    }

    /**
     * Starts chat bot. It will listen for updates from VK
     */
    public async start() {
        const groupId = await this.vkApi.getGroupId();

        const updatesListener = new UpdatesListener(
            this.vkApi,
            groupId,
            this.settings.pollingTimeout
        );

        for await (let updates of updatesListener.start()) {
            this.updatesHandler.handle(updates);
        }
    }

    /**
     * Reply to user
     */
    public reply(userId: string | string[], message: VkResponse) {
        this.responder.reply(userId, message);
    }

    /**
     * Set callbacks for eventNames
     * @param eventName - vk update type, i.e. message_new, message_typing_state
     * @param callback - callback handler
     */
    public on(eventName: string, callback: Function) {
        this.updatesHandler.on(eventName, callback);
    }
}
