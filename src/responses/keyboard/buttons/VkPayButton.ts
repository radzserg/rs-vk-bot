import KeyboardButton, { VkButtonType } from "./KeyboardButton";

export default class VkPayButton extends KeyboardButton {
    protected type: VkButtonType = "vkpay";
    private readonly hash: string;

    constructor(hash: string, payload?: any) {
        super();
        this.hash = hash;
        this.payload = payload;
    }

    toJSON() {
        return {
            action: {
                type: this.type,
                hash: this.hash,
                payload: JSON.stringify(this.payload),
            },
        };
    }
}
