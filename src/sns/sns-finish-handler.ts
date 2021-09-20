import { SnsInfo } from "./model";
import { Entry, Key } from "./dependency/database/model";
import { SnsHandlerBase } from "./sns-handler-base";

export class SnsFinishHandler extends SnsHandlerBase {
    protected override async getEntry(snsInfo: SnsInfo): Promise<Entry> {
        const key: Key = {
            deviceId: snsInfo.deviceId,
        }
        const oldEntry = await this.dependency.database.get(key);

        return this.updateTime(oldEntry, snsInfo);
    }

    private updateTime(oldEntry: Entry, snsInfo: SnsInfo): Entry {
        for (const adId in oldEntry.ads) {
            oldEntry.ads[adId].endTime = snsInfo.time;
        }

        oldEntry.ttl = snsInfo.time + 600;

        return oldEntry;
    }
}
