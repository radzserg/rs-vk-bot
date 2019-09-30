import ButtonsRow from "./keyboard/ButtonsRow";

/**
 * https://vk.com/dev/bots_docs_3
 */
export default class Keyboard {
    private oneTimeKeyboard: boolean = false;
    private readonly buttonRows: ButtonsRow[];

    constructor(buttonRows: ButtonsRow[]) {
        this.buttonRows = buttonRows;
    }

    oneTime(value = true) {
        this.oneTimeKeyboard = value;
        return this;
    }

    toJSON() {
        return JSON.stringify({
            one_time: this.oneTimeKeyboard,
            buttons: this.buttonRows,
        });
    }
}
