import { FlatEntry } from "./dependency/database/model";
import { Transformer } from "./dependency/database/transformer";
import { Dependency } from "./dependency/dependency";
import { SnsEvent } from "./sns-event";
import { SnsHandler } from "./sns-handler";
import { SnsInfo } from "./sns-info";

export abstract class SnsHandlerBase implements SnsHandler {
    constructor(protected dependency: Dependency) { }

    public async handle(snsEvent: SnsEvent) {
        const snsInfo: SnsInfo = this.eventToInfo(snsEvent);
        const flatEntry = await this.getFlatEntry(snsInfo);
        const trackingUrls = this.dependency.vastParser.parseUrls(flatEntry.vastString);

        await Promise.all([this.writeToDb(flatEntry), this.fireUrls(trackingUrls)]);
    }

    protected abstract getFlatEntry(snsInfo: SnsInfo): Promise<FlatEntry>;

    private writeToDb(flatEntry: FlatEntry): Promise<void> {
        return this.dependency.database.put(Transformer.flatToActual(flatEntry));
    }

    private fireUrls(urls: string[]) {
        return this.dependency.urlSender.fireTrackingUrls(urls);
    }

    private eventToInfo(snsEvent: SnsEvent): SnsInfo {
        return {
            deviceId: snsEvent.id,
            adVastUrl: JSON.parse(snsEvent.message).url,
            time: snsEvent.time,
        }
    }
}


