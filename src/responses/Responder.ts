import VkResponse from "./VkResponse";
import VkApi from "../api/VkApi";

export default class Responder {
    private vkApi: VkApi;

    constructor(vkApi: VkApi) {
        this.vkApi = vkApi;
    }

    public reply(userId: string | string[], response: VkResponse) {
        if (Array.isArray(userId) && userId.length > 100) {
            throw new Error(
                "Message can't be sent to more than 100 recipients."
            );
        }
        let params: any = { ...response };
        if (Array.isArray(userId)) {
            params.user_ids = userId.join(",");
        } else {
            params.peer_id = userId;
        }

        this.vkApi.sendMessage(params);
    }
}
