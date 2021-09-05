import { Entry } from "./dependency/database/model";
import { Dependency } from "./dependency/dependency";
import { TrackingUrlType } from "./dependency/tracking-url/type";
import { SnsHandler } from "./sns-handler";
import { SnsEvent, SnsEventSubject, SnsInfo } from "@sns/sns-model";

export abstract class SnsHandlerBase implements SnsHandler {
    constructor(protected dependency: Dependency) { }

    public async handle(snsEvent: SnsEvent) {
        const snsInfo: SnsInfo = this.eventToInfo(snsEvent);
        const entry = await this.getEntry(snsInfo);
        const trackingUrls = await this.parseTrackingUrls(entry, snsInfo);
        await Promise.all([this.writeToDb(entry), this.fireUrls(trackingUrls)]);
    }

    protected abstract getEntry(snsInfo: SnsInfo): Promise<Entry>;

    private async parseTrackingUrls(entry: Entry, snsInfo: SnsInfo): Promise<string[]> {
        const nestedUrls = await Promise.all(Object.values(entry.ads).map((adEntry) =>
            this.dependency.snsVastParser.parseUrls(adEntry.adBlob, TrackingUrlType[snsInfo.subject])
        ));

        return nestedUrls.flat();
    }

    private writeToDb(entry: Entry): Promise<void> {
        return this.dependency.database.put(entry);
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


