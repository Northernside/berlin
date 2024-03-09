import { Channel, broadcastMessage } from "../misc/utils";

const helloWorldPlugin = {
    name: "HelloWorldPlugin",
    run: async function () {
        broadcastMessage(this, Channel.DISCORD, "Hello, world!");
    }
};

export default helloWorldPlugin;