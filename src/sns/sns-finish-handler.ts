import { Entry, Key } from "./dependency/database/model";
import { SnsHandlerBase } from "./sns-handler-base";
import { SnsInfo } from "@sns/model";

export class SnsFinishHandler extends SnsHandlerBase {
    protected override async getEntry(snsInfo: SnsInfo): Promise<Entry> {
        const key: Key = {
            deviceId: snsInfo.deviceId,
        }
        const oldEntry = await this.dependency.database.get(key);

        for (const adId in oldEntry.ads) {
            oldEntry.ads[adId].endTime = snsInfo.time;
        }

        oldEntry.ttl = snsInfo.time + 600;

        return oldEntry;
    }
}