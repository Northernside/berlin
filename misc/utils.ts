import type { Plugin } from "./pluginmanager";

export enum Channel {
    DISCORD
}

export function broadcastMessage(plugin: Plugin, channel: Channel, message: string) {
    switch (channel) {
        case Channel.DISCORD:
            discordBroadcast(message, plugin.name);
            break;
    }
}

function discordBroadcast(message: string, pluginName: string) {
    const webhookUrl: string = Bun.env[`${pluginName}_DISCORD_WEBHOOK`] || Bun.env.DEFAULT_DISCORD_WEBHOOK!;

    fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: pluginName,
            content: message
        })
    });
}