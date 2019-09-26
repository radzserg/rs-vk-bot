import axios from "axios";
import queryString from "query-string";

export interface ILongPollingServerData {
    key: string;
    server: string;
    ts: string;
}

interface IBufferAction {
    code: string;
    callback?: Function;
}

export default class VkApi {
    private readonly accessToken: string;
    private executeTimeout: number;

    private bufferActions: IBufferAction[] = [];

    constructor(accessToken: string, executeTimeout: number) {
        this.accessToken = accessToken;

        setInterval(() => {
            this.runBufferActions();
        }, executeTimeout);
    }

    public async getGroupId(): Promise<string> {
        const { response } = await this.request("groups.getById", {
            access_token: this.accessToken,
        });

        return response[0].id;
    }

    public async getLongPollingServer(
        groupId: string
    ): Promise<ILongPollingServerData> {
        const { response } = await this.request("groups.getLongPollServer", {
            group_id: groupId,
        }).catch((err: any) => {
            throw new Error(
                "Cannot get VK long polling server params:\n" + err
            );
        });
        return response;
    }

    public sendMessage(params: any): void {
        this.execute("messages.send", params);
    }

    /**
     * We need to send responses in batches to prevent "Too many requests per second"
     * error from VK
     */
    private execute(method: string, params: any, callback?: Function): void {
        this.bufferActions.push({
            code: `API.${method}(${JSON.stringify({
                v: "5.80",
                ...params,
            })})`,
            callback,
        });
    }

    /**
     * Run batch of actions from buffer
     */
    private runBufferActions() {
        const methods = this.bufferActions;
        for (let i = 0, j = Math.ceil(methods.length / 25); i < j; i++) {
            const slicedMethods = methods.slice(i * 25, i * 25 + 25);

            this.request("execute", {
                code: `return [ ${slicedMethods.map(item => item.code)} ];`,
            })
                .then(({ response, execute_errors = [] }) => {
                    execute_errors.forEach((err: any) =>
                        console.error(`Execute Error: ${JSON.stringify(err)}`)
                    );
                    response.forEach((body: any, i: number) => {
                        const callback = slicedMethods[i].callback;
                        if (callback) {
                            callback(body);
                        }
                    });
                })
                .catch(err => console.error(err));
        }
        this.bufferActions = [];
    }

    private async request(method: string, params: any) {
        const { data } = await axios.post(
            `https://api.vk.com/method/${method}`,
            queryString.stringify({
                v: 5.8,
                access_token: this.accessToken,
                ...params,
            })
        );

        if (data.error) {
            throw new Error(JSON.stringify(data));
        }

        return data;
    }
}
