import KeyboardButton from "./KeyboardButton";

type ButtonColor = "primary" | "secondary" | "negative" | "positive";

export default class TextButton extends KeyboardButton {
    private readonly label: string;
    private readonly color: ButtonColor;
    private readonly payload: any;

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
                type: 'text',
                payload: JSON.stringify(this.payload),
                label: this.label,
            },
        };
    }
}
