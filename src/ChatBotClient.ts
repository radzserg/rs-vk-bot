import axios from "axios";
import queryString from "query-string";
import LongPollingServer, { PollingError } from "./LongPollingServer";
import EventDispatcher from "rsed";
import VkUpdateListener from "./VkUpdateListener";

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
        pollingTimeout: 10,
        executeTimeout: 50,
    };
    private eventDispatcher: EventDispatcher;

    constructor(token: string, settings?: IChatBotClientSettings) {
        this.token = token;
        this.settings = {
            ...this.settings,
            ...settings,
        };
        this.eventDispatcher = new EventDispatcher();
        this.eventDispatcher.addListenerProvider(
            new VkUpdateListener()
        );
    }

    async start() {
        await this.defineGroupId();
        const longPollingServerData = await this.getLongPollingServer();
        const longPollServer = new LongPollingServer(
            longPollingServerData,
            this.eventDispatcher,
            this.settings.pollingTimeout
        );
        console.log("Start polling");
        try {
            await longPollServer.startPolling();
        } catch (error) {
            if (error instanceof PollingError) {
                console.error("Polling error", error);
                await this.start();
            }
        }
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
