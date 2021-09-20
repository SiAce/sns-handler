import { Entry } from "./dependency/database/model";
import { SnsDependency } from "./dependency/dependency";
import { TrackingUrlType } from "./dependency/tracking-url/model";
import { SnsHandler } from "./sns-handler";
import { SnsEventSubject, SnsInfo } from "./model";

export abstract class SnsHandlerBase implements SnsHandler {
    constructor(protected dependency: SnsDependency) { }

    public async handle(snsInfo: SnsInfo) {
        const entry = await this.getEntry(snsInfo);
        return await Promise.allSettled([
            this.writeToDb(entry),
            this.parseUrls(entry, snsInfo.subject)
                .then((urls) => this.dependency.urlSender.fireTrackingUrls(urls))
        ]);
    }

    protected abstract getEntry(snsInfo: SnsInfo): Promise<Entry>;

    private async parseUrls(entry: Entry, subject: SnsEventSubject): Promise<string []> {
        const nestedUrls = await Promise.all(Object.values(entry.ads).map((adEntry) =>
            this.dependency.snsVastParser.parseUrls(adEntry.adBlob, TrackingUrlType[subject])
        ));

        return nestedUrls.flat();
    }

    private writeToDb(entry: Entry): Promise<void> {
        return this.dependency.database.put(entry);
    }
}


