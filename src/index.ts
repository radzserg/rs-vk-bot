import ChatBotClient from "./ChatBotClient";
import VkResponse from "./responses/VkResponse";
import VkMessage from "./updates/VkMessage";
import Keyboard from "./responses/Keyboard";
import TextButton from "./responses/keyboard/buttons/TextButton";
import LocationButton from "./responses/keyboard/buttons/LocationButton";
import OpenAppButton from "./responses/keyboard/buttons/OpenAppButton";
import VkPayButton from "./responses/keyboard/buttons/VkPayButton";

export default ChatBotClient;

export {
    VkResponse,
    VkMessage,
    Keyboard,
    TextButton,
    LocationButton,
    OpenAppButton,
    VkPayButton
}
