import { FlatEntry } from "./dependency/database/model";
import { Transformer } from "./dependency/database/transformer";
import { Dependency } from "./dependency/dependency";
import { TrackingUrlType } from "./dependency/tracking-url/type";
import { SnsEvent } from "./sns-event";
import { SnsEventSubject } from "./sns-event-subject";
import { SnsHandler } from "./sns-handler";
import { SnsInfo } from "./sns-info";

export abstract class SnsHandlerBase implements SnsHandler {
    constructor(protected dependency: Dependency) { }

    public async handle(snsEvent: SnsEvent) {
        const snsInfo: SnsInfo = this.eventToInfo(snsEvent);
        const flatEntry = await this.getFlatEntry(snsInfo);
        const trackingUrls = await this.dependency.snsVastParser.parseUrls(flatEntry.vastString, TrackingUrlType[snsInfo.subject]);
        await Promise.all([this.writeToDb(flatEntry), this.fireUrls(trackingUrls)]);
    }

    protected abstract getFlatEntry(snsInfo: SnsInfo): Promise<FlatEntry>;

    private writeToDb(flatEntry: FlatEntry): Promise<void> {
        return this.dependency.database.put(Transformer.flatToActual(flatEntry));
    }

    private async fireUrls(urls: string[]) {
        try {
            return await this.dependency.urlSender.fireTrackingUrls(urls);
        } catch (error) {
            throw new Error("Cannot fire tracking urls");
        }
        
    }

    private eventToInfo(snsEvent: SnsEvent): SnsInfo {
        return {
            subject: snsEvent.subject as SnsEventSubject,
            deviceId: snsEvent.id,
            adVastUrl: JSON.parse(snsEvent.message).url,
            time: snsEvent.time,
        }
    }
}


