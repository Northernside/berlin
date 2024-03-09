import { Channel, broadcastMessage } from "./misc/utils";
import { PluginManager, type Plugin } from "./misc/pluginmanager";
import fs from "node:fs";

const core: Plugin = { name: "Core", run: () => { } };
const pluginManager = new PluginManager();

for (let files of fs.readdirSync("./plugins")) {
    if (files.endsWith(".ts")) {
        const plugin = require(`./plugins/${files}`);
        pluginManager.registerPlugin(plugin.default);
    }
}

broadcastMessage(core, Channel.DISCORD, `Registered ${pluginManager.plugins.length} plugin${pluginManager.plugins.length === 1 ? "" : "s"}.\n\n${pluginManager.plugins.map(plugin => `\\- ${plugin.name}`).join("\n")}`);
pluginManager.executePlugins();