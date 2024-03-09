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
        if (plugin && typeof plugin.run === "function") this.plugins.push(plugin);
        else console.error(`[${plugin.name}] Invalid plugin format.`);
    }

    executePlugins() {
        this.plugins.forEach(plugin => plugin.run());
    }
}