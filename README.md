# berlin

## Plugin Example

> Grabs data from the NINA-Warn-App (used for announcing threats such as harsh weather, evacuations, etc.) and reposts them for your location into Discord.

> Location data is defined by a region-key and [NINA's API Documentation](https://nina.api.bund.dev) explains how they work.


### Code
```js
import { Channel, Storage, broadcastMessage, getData, storeData } from "../misc/utils";

const NINAWarning = {
    name: "NINA",
    run: async function () {
        const plugin = this;

        let id = "066310009009";
        id = id.slice(0, id.length - 7).padEnd(12, "0");

        setInterval(async () => {
            const response = await fetch(`https://nina.api.proxy.bund.dev/api31/dashboard/${id}.json`);
            let json;
            try {
                json = await response.json();
            } catch (e) {
                console.error("Error parsing JSON:", e);
                broadcastMessage(plugin, Channel.DISCORD, "Error parsing JSON:\n\`\`\`js\n" + e + "\n\`\`\`");
                return;
            }

            let alerts = [];
            for (const alert of json)
                alerts.push({
                    id: alert.id,
                    type: alert.payload.type,
                    level: alert.payload.data.severity,
                    title: alert.payload.data.headline,
                    sent: `Started ${formatDateDifference(alert.sent)}`,
                    expires: alert.expires ? `Ends ${formatDateDifference(alert.expires)}` : "No end date yet"
                });

            const previousData = JSON.parse(getData(plugin, "nina.json") || "[]");
            alerts.forEach(alert => {
                if (!previousData.some(prevAlert => prevAlert.id === alert.id))
                    broadcastMessage(plugin, Channel.DISCORD, `@everyone NINA Alert\n\n**Type**: ${alert.type}\n**Level**: ${alert.level}\n**Title**: ${alert.title}\n**Sent**: ${alert.sent}\n**Expires**: ${alert.expires}`);
            });

            storeData(plugin, Storage.JSON_FILE, "nina", json);
        }, 60 * 1000);
    }
};

function formatDateDifference(inputDate: string): string {
    const now = new Date(), targetDate = new Date(inputDate); // @ts-ignore
    let diff = targetDate - now;

    const isInFuture = diff > 0;

    diff = Math.abs(diff);
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return `today at ${targetDate.getHours().toString().padStart(2, "0")}:${targetDate.getMinutes().toString().padStart(2, "0")}`;

    const dayString = diffDays === 1 ? "day" : "days";
    return `${diffDays} ${dayString} ${isInFuture ? "from now" : "ago"}`;
}

export default NINAWarning;
```

### Output
<img width="1146" alt="image" src="https://github.com/Northernside/berlin/assets/60970791/aa7b4f22-b4d2-4dcb-9ef4-6d2ea3f2e318">
