import KeyboardButton, { VkButtonType } from "./KeyboardButton";

export default class LocationButton extends KeyboardButton {
    protected type: VkButtonType = "location";

    constructor(payload?: any) {
        super();
        this.payload = payload;
    }

    toJSON() {
        return {
            action: {
                type: this.type,
                payload: JSON.stringify(this.payload),
            },
        };
    }
}
