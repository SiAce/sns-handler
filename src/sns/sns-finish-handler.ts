import { FlatEntry, Key } from "./dependency/database/model";
import { Transformer } from "./dependency/database/transformer";
import { SnsHandlerBase } from "./sns-handler-base";
import { SnsInfo } from "./sns-info";

export class SnsFinishHandler extends SnsHandlerBase {
    protected override async getFlatEntry(snsInfo: SnsInfo): Promise<FlatEntry> {
        const key: Key = {
            deviceId: snsInfo.deviceId,
        }
        const entry = await this.dependency.database.get(key);

        const flatEntry = Transformer.actualToFlat(entry);

        flatEntry.endTime = snsInfo.time;
        flatEntry.ttl = snsInfo.time + 600;

        return flatEntry;
    }
}