import VkUpdatesListener from "./VkUpdatesListener";
import VkUpdatesHandler from "./VkUpdatesHandler";
import VkApi from "./VkApi";

interface IChatBotClientSettings {
    pollingTimeout: number;
    executeTimeout: number;
}

export default class ChatBotClient {
    private readonly settings: IChatBotClientSettings = {
        pollingTimeout: 25,
        executeTimeout: 50,
    };
    private updatesHandler: VkUpdatesHandler;
    private readonly vkApi: VkApi;

    constructor(token: string, settings?: IChatBotClientSettings) {
        this.settings = {
            ...this.settings,
            ...settings,
        };
        this.vkApi = new VkApi(token);

        this.updatesHandler = new VkUpdatesHandler();
    }

    public async start() {
        const groupId = await this.vkApi.getGroupId();

        const updatesListener = new VkUpdatesListener(
            this.vkApi,
            groupId,
            this.settings.pollingTimeout
        );

        for await (let updates of updatesListener.start()) {
            this.updatesHandler.handle(updates);
        }
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
