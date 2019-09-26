import axios from "axios";
import { VkUpdate } from "./messages/VkUpdate";
import VkApi, { ILongPollingServerData } from "./VkApi";
import Debugger from "debug";

class PollingError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, PollingError.prototype);
    }
}

const debug = Debugger("rs-vk-bot");

/**
 * Listen for updates from VK via long polling
 */
export default class VkUpdatesListener {
    private readonly vkApi: VkApi;
    private readonly groupId: string;
    private pollingTimeout: number;

    private ts: string;

    constructor(vkApi: VkApi, groupId: string, pollingTimeout: number) {
        this.vkApi = vkApi;
        this.groupId = groupId;
        this.pollingTimeout = pollingTimeout;
    }

    /**
     * Fetches long poll server data and start polling server
     */
    public async *start(): AsyncIterable<VkUpdate[]> {
        const longPollingServerData: ILongPollingServerData = await this.vkApi.getLongPollingServer(
            this.groupId
        );
        debug("Start polling VK server");

        try {
            for await (let updates of this.pollServer(longPollingServerData)) {
                yield updates;
            }
        } catch (error) {
            if (error instanceof PollingError) {
                debug(
                    `Polling error, restarting polling\nDetails${error.message}`
                );
                for await (let updates of this.start()) {
                    yield updates;
                }
            }
        }
    }

    /**
     * Poll server and liisten for updates from VK
     * @param longPollingServerData
     */
    public async *pollServer(
        longPollingServerData: ILongPollingServerData
    ): AsyncIterable<VkUpdate[]> {
        const { server, key, ts } = longPollingServerData;
        while (true) {
            const response = await axios
                .get(server, {
                    params: {
                        key,
                        ts,
                        act: "a_check",
                        wait: this.pollingTimeout,
                    },
                })
                .catch(err => {
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
