import KeyboardButton, { VkButtonType } from "./KeyboardButton";

type ButtonColor = "primary" | "secondary" | "negative" | "positive";

export default class TextButton extends KeyboardButton {
    protected type: VkButtonType = "text";
    private readonly label: string;
    private readonly color: ButtonColor;

    constructor(
        label: string,
        color: ButtonColor = "secondary",
        payload?: any
    ) {
        super();
        this.label = label;
        this.color = color;
        this.payload = payload;
    }

    toJSON() {
        return {
            action: {
                type: this.type,
                payload: JSON.stringify(this.payload),
                label: this.label,
            },
        };
    }
}
