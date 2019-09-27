export default interface VkMessage {
    id: number;
    date: number;
    out: number;
    user_id: number;
    read_state: number;
    title: string;
    body: string;
    owner_ids: number[];
    type: string; // 'message_new'
}
