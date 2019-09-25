import axios from "axios";
import { VkUpdate } from "./updates/VkUpdate";
import { IEventDispatcher } from "rsed";
import VkUpdatesReceived from "./events/VkUpdatesReceived";

interface ILongPollingServerData {
    key: string;
    server: string;
    ts: string;
}

export class PollingError extends Error {}

export default class LongPollingServer {
    private serverUrl: string;
    private secretKey: string;
    private ts: string;
    private pollingTimeout: number;
    private eventDispatcher: IEventDispatcher;

    constructor(
        serverData: ILongPollingServerData,
        eventDispatcher: IEventDispatcher,
        pollingTimeout: number
    ) {
        this.eventDispatcher = eventDispatcher;
        this.serverUrl = serverData.server;
        this.secretKey = serverData.key;
        this.ts = serverData.ts;
        this.pollingTimeout = pollingTimeout
    }

    public async startPolling(): Promise<void> {
        const response = await axios.get(this.serverUrl, {
            params: {
                key: this.secretKey,
                ts: this.ts,
                act: "a_check",
                wait: this.pollingTimeout,
            },
        }).catch((err) => {
            throw new PollingError(err);
        });

        const body = response.data;
        this.ts = body.ts;
        if (body.failed) {
            // https://vk.com/dev/using_longpoll
            if (body.failed !== 1) {
                throw new PollingError(body);
            }
        }

        const updates: VkUpdate[] = body.updates;
        this.eventDispatcher.dispatch(new VkUpdatesReceived(updates));

        this.startPolling();
    }
}
