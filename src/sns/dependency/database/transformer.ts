import { Entry, FlatEntry } from "./model";

export class Transformer {
    public static flatToActual(flatEntry: FlatEntry): Entry {
        return {
            deviceId: flatEntry.deviceId,
            ads: {
                [flatEntry.adId]: {
                    adBlob: flatEntry.vastString,
                    startTime: flatEntry.startTime,
                    endTime: flatEntry.endTime,
                }
            },
            ttl: flatEntry.ttl
        }
    }

    public static actualToFlat(entry: Entry): FlatEntry {
        const adId = +Object.keys(entry.ads)[0];
        const adEntry = entry.ads[adId];

        return {
            deviceId: entry.deviceId,
            adId,
            vastString: adEntry.adBlob,
            startTime: adEntry.startTime,
            endTime: adEntry.endTime,
            ttl: entry.ttl
        }
    }
}
