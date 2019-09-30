import KeyboardButton, { VkButtonType } from "./KeyboardButton";

export default class OpenAppButton extends KeyboardButton {
    protected type: VkButtonType = "open_app";
    private readonly appId: number;
    private readonly ownerId: number;
    private readonly hash: string;
    private readonly label: string;

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
