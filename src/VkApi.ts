import axios from "axios";
import queryString from "query-string";

export interface ILongPollingServerData {
    key: string;
    server: string;
    ts: string;
}

export default class VkApi {
    private readonly accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    public async getGroupId(): Promise<string> {
        const { response } = await this.request("groups.getById", {
            access_token: this.accessToken,
        });

        return response[0].id;
    }

    public async getLongPollingServer(groupId: string): Promise<ILongPollingServerData> {
        const { response } = await this.request("groups.getLongPollServer", {
            group_id: groupId,
        }).catch((err: any) => {
            throw new Error(
                "Cannot get VK long polling server params:\n" + err
            );
        });
        return response;
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