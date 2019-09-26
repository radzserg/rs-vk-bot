import axios from "axios";
import queryString from "query-string";
import VkUpdatesListener, { PollingError } from "./VkUpdatesListener";
import VkUpdatesHandler from "./VkUpdatesHandler";
import { VkUpdate } from "./messages/VkUpdate";

interface ILongPollingServer {
    key: string;
    server: string;
    ts: string;
}

interface IChatBotClientSettings {
    pollingTimeout: number;
    executeTimeout: number;
}

export default class ChatBotClient {
    private readonly token: string;
    private groupId: string;
    private readonly settings: IChatBotClientSettings = {
        pollingTimeout: 25,
        executeTimeout: 50,
    };
    private updatesHandler: VkUpdatesHandler;

    constructor(token: string, settings?: IChatBotClientSettings) {
        this.token = token;
        this.settings = {
            ...this.settings,
            ...settings,
        };
        this.updatesHandler = new VkUpdatesHandler();
    }

    public async start() {
        await this.defineGroupId();
        const longPollingServerData = await this.getLongPollingServer();
        const longPollServer = new VkUpdatesListener(
            longPollingServerData,
            this.settings.pollingTimeout
        );

        try {
            for await (let updates of longPollServer.start()) {
                this.updatesHandler.handle(updates);
            }
        } catch (error) {
            if (error instanceof PollingError) {
                console.error("Polling error, restarting polling", error);
                await this.start();
            }
        }
    }

    /**
     * Set callbacks for eventNames
     * @param eventName - vk update type, i.e. message_new, message_typing_state
     * @param callback - callback handler
     */
    public on(eventName: string, callback: Function) {
        this.updatesHandler.on(eventName, callback)
    }

    private async getLongPollingServer(): Promise<ILongPollingServer> {
        const { response } = await this.request("groups.getLongPollServer", {
            group_id: this.groupId,
        }).catch((err: any) => {
            throw new Error(
                "Cannot get VK long polling server params:\n" + err
            );
        });
        return response;
    }

    private async defineGroupId() {
        if (!this.groupId) {
            const { response } = await this.request("groups.getById", {
                access_token: this.token,
            });

            this.groupId = response[0].id;
        }
    }

    private async request(method: string, params: any) {
        const { data } = await axios.post(
            `https://api.vk.com/method/${method}`,
            queryString.stringify({
                v: 5.8,
                access_token: this.token,
                ...params,
            })
        );

        if (data.error) {
            throw new Error(JSON.stringify(data));
        }

        return data;
    }
}
