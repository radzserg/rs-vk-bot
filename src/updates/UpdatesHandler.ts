import { VkUpdateEvent } from "./VkUpdateEvent";

interface IVkUpdateHandlers {
    [vkUpdateName: string]: Function[];
}

export default class UpdatesHandler {
    private updateHandlers: IVkUpdateHandlers = {};

    on(eventName: string, callback: Function) {
        if (this.updateHandlers[eventName] === undefined) {
            this.updateHandlers[eventName] = [];
        }
        this.updateHandlers[eventName].push(callback);
    }

    public handle = (updates: VkUpdateEvent[]) => {
        for (let update of updates) {
            const updateType = update.type;
            const handlers = this.updateHandlers[updateType];
            if (handlers !== undefined) {
                for (let handler of handlers) {
                    handler(update.object);
                }
            }
        }
    };
}
