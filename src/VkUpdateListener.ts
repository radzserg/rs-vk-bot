import { AppEventHandler, IListenerProvider } from "rsed";
import VkUpdatesReceived from "./events/VkUpdatesReceived";

export default class VkUpdateListener implements IListenerProvider {

    getListenersForEvent(event: object): AppEventHandler[] {
        if (event instanceof VkUpdatesReceived) {
            return [this.handleUpdates];
        }
        return [];
    }

    private handleUpdates(event: VkUpdatesReceived) {
        const updates = event.getUpdates();
        console.log("Received updates", updates);
    }
}