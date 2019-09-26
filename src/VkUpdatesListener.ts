import axios from "axios";
import { VkUpdate } from "./messages/VkUpdate";

interface ILongPollingServerData {
    key: string;
    server: string;
    ts: string;
}

export class PollingError extends Error {}

export default class VkUpdatesListener {
    private serverUrl: string;
    private secretKey: string;
    private ts: string;
    private pollingTimeout: number;

    constructor(
        serverData: ILongPollingServerData,
        pollingTimeout: number
    ) {
        this.serverUrl = serverData.server;
        this.secretKey = serverData.key;
        this.ts = serverData.ts;
        this.pollingTimeout = pollingTimeout
    }

    public async *start(): AsyncIterable<VkUpdate[]> {
        while (true) {
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

            yield body.updates as VkUpdate[];
        }
    }
}
