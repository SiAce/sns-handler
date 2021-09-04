import { SnsEventHandler } from "./sns-event-handler";
import { SnsEvent } from "./sns-event";
import { FlatEntry, Key } from "src/dependency/database/model";
import { Transformer } from "src/dependency/database/transformer";

export class SnsFinishHandler extends SnsEventHandler {
    override async getFlatEntry(): Promise<FlatEntry> {
        const key: Key = {
            deviceId: this.snsInfo.deviceId,
        }
        const entry = await this.dependency.database.get(key);

        const flatEntry = Transformer.actualToFlat(entry);

        flatEntry.endTime = this.snsInfo.time;
        flatEntry.ttl = this.snsInfo.time + 600;

        return flatEntry;
    }

}