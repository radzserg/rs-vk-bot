import VkUpdatesReceived from "./events/VkUpdatesReceived";
import { VkUpdate } from "./messages/VkUpdate";
import VkResponse from "./messages/VkResponse";

interface IVkUpdateHandlers {
    [vkUpdateName: string]: Function[];
}

export default class VkUpdateListener  {

    private updateHandlers: IVkUpdateHandlers = {};

    on(eventName: string, callback: Function) {
        if (this.updateHandlers[eventName] === undefined) {
            this.updateHandlers[eventName] = [];
        }
        this.updateHandlers[eventName].push(callback);
    }

    private handleUpdates = (event: VkUpdatesReceived) => {
        const updates = event.getUpdates();
        updates.forEach((update: VkUpdate) => {
            const updateType = update.type;
            const handlers = this.updateHandlers[updateType];
            if (handlers !== undefined) {
                handlers.forEach((handler: Function) => {
                    const response = handler(update.object);
                    if (response && response instanceof VkResponse) {

                    }
                })
            }
        });
    }
}