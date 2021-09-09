import { Entry } from "./dependency/database/model";
import { SnsDependency } from "./dependency/dependency";
import { TrackingUrlType } from "./dependency/tracking-url/model";
import { SnsHandler } from "./sns-handler";
import { SnsEvent, SnsEventSubject, SnsInfo } from "@sns/model";

export abstract class SnsHandlerBase implements SnsHandler {
    constructor(protected dependency: SnsDependency) { }

    public async handle(snsInfo: SnsInfo) {
        const entry = await this.getEntry(snsInfo);
        await Promise.allSettled([this.writeToDb(entry), this.parseAndFireUrls(entry, snsInfo)]);
    }

    protected abstract getEntry(snsInfo: SnsInfo): Promise<Entry>;

    private async parseAndFireUrls(entry: Entry, snsInfo: SnsInfo) {
        const nestedUrls = await Promise.all(Object.values(entry.ads).map((adEntry) =>
            this.dependency.snsVastParser.parseUrls(adEntry.adBlob, TrackingUrlType[snsInfo.subject])
        ));

        const flatUrls = nestedUrls.flat();

        await this.dependency.urlSender.fireTrackingUrls(flatUrls);
    }

    private writeToDb(entry: Entry): Promise<void> {
        return this.dependency.database.put(entry);
    }
}


