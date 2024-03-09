import fs from "node:fs";

export type Plugin = {
    name: string;
    run: () => void;
};

export class PluginManager {
    plugins: Plugin[];

    constructor() {
        this.plugins = [];
    }

    registerPlugin(plugin: Plugin) {
        if (plugin && typeof plugin.run === "function") {
            this.plugins.push(plugin);
            fs.mkdirSync(`./data/${plugin.name}`, { recursive: true });
        } else console.error(`[${plugin.name}] Invalid plugin format.`);
    }

    executePlugins() {
        this.plugins.forEach(plugin => plugin.run());
    }
}