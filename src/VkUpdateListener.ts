import { AppEventHandler, IListenerProvider } from "rsed";
import VkUpdatesReceived from "./events/VkUpdatesReceived";
import { VkUpdate } from "./updates/VkUpdate";


interface IVkUpdateHandlers {
    [vkUpdateName: string]: Function[];
}

export default class VkUpdateListener implements IListenerProvider {
    private updateHandlers: IVkUpdateHandlers = {};

    // private handlers
    getListenersForEvent(event: object): AppEventHandler[] {
        if (event instanceof VkUpdatesReceived) {
            return [this.handleUpdates];
        }
        return [];
    }

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
                    handler(update.object);
                })
            }
        });
    }
}