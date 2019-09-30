export type VkButtonType = "text" | "location" | "vkpay" | "open_app";

export default abstract class KeyboardButton {
    protected payload: any;
    protected abstract type: VkButtonType;
}