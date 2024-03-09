import type { Plugin } from "./pluginmanager";
import fs from "node:fs";

export enum Channel {
    DISCORD
}

export enum Storage {
    JSON_FILE,
    CSV_FILE,
    RAW
}

export function broadcastMessage(plugin: Plugin, channel: Channel, message: string) {
    switch (channel) {
        case Channel.DISCORD:
            discordBroadcast(message, plugin.name);
            break;
    }
}

function discordBroadcast(message: string, pluginName: string) {
    const webhookUrl: string = Bun.env[`${pluginName.toUpperCase()}_DISCORD_WEBHOOK`] || Bun.env.DEFAULT_DISCORD_WEBHOOK!;

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

export function storeData(plugin: Plugin, storage: Storage, name: string, data: any) {
    switch (storage) {
        case Storage.JSON_FILE:
            storeJSON(plugin, name, data);
            break;
        case Storage.CSV_FILE:
            storeCSV(plugin, name, data);
            break;
        case Storage.RAW:
            storeRaw(plugin, name, data);
            break;
    }
}

export function getData(plugin: Plugin, name: string): any {
    if (fs.existsSync(`./data/${plugin.name}/${name}`)) return fs.readFileSync(`./data/${plugin.name}/${name}`);
    else return null;
}

function storeJSON(plugin: Plugin, name: string, data: any) {
    fs.writeFileSync(`./data/${plugin.name}/${name}.json`, JSON.stringify(data));
}

function storeCSV(plugin: Plugin, name: string, data: any, append: boolean = false) {
    let csv = "";
    for (let item of data)
        csv += item.join(",") + "\n";

    if (append) fs.appendFileSync(`./data/${plugin.name}/${name}.csv`, csv);
    else fs.writeFileSync(`./data/${plugin.name}/${name}.csv`, csv);
}

function storeRaw(plugin: Plugin, name: string, data: any, append: boolean = false) {
    if (append) fs.appendFileSync(`./data/${plugin.name}/${name}`, data);
    else fs.writeFileSync(`./data/${plugin.name}/${name}`, data);
}