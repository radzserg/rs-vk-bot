import KeyboardButton, { VkButtonType } from "./KeyboardButton";

export default class VkPayButton extends KeyboardButton {
    protected type: VkButtonType = "location";
    private appId: number;
    private ownerId: number;
    private hash: string;
    private label: string;

    constructor(appId: number, ownerId: number, hash: string, label: string, payload?: any) {
        super();
        this.appId = appId;
        this.ownerId = ownerId;
        this.hash = hash;
        this.label = label;
        this.payload = payload;
    }

    toJSON() {
        return {
            action: {
                type: this.type,
                app_id: this.appId,
                owner_id: this.ownerId,
                hash: this.hash,
                label: this.label,
                payload: JSON.stringify(this.payload),
            },
        };
    }
}
