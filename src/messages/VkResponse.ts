export default class VkResponse {
    private readonly message: string;
    constructor(message: string) {
        this.message = message;
    }
    public getMessage() {
        return this.message;
    }
}