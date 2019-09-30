import KeyboardButton from "./buttons/KeyboardButton";

const BUTTONS_PER_ROW = 4;

export default class ButtonsRow {
    public readonly buttons: KeyboardButton[];

    constructor(buttons: KeyboardButton[]) {
        if (buttons.length === 0) {
            throw new Error("Please include at least one button");
        }
        if (buttons.length > BUTTONS_PER_ROW) {
            throw new Error(
                `Button row can only include ${BUTTONS_PER_ROW} buttons`
            );
        }
        this.buttons = buttons;
    }

    toJSON() {
        return this.buttons;
    }
}
