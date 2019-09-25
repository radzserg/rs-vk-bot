import { VkUpdate } from "../updates/VkUpdate";

export default class VkUpdatesReceived {
    private readonly updates: VkUpdate[];
    constructor(updates: VkUpdate[]) {
        this.updates = updates;
    }

    public getUpdates(): VkUpdate[] {
        return this.updates;
    }
}
