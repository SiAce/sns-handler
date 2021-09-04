import { SnsEvent } from "./sns-event";
import { SnsInfo } from "./sns-info";
import { VastParser } from "src/dependency/vast/vast-parser";
import { Database } from "src/dependency/database/database";
import axios from "axios";
import { Dependency } from "src/dependency/dependency";
import { FlatEntry } from "src/dependency/database/model";
import { Transformer } from "src/dependency/database/transformer";

export abstract class SnsEventHandler {
    protected snsInfo: SnsInfo;

    constructor(snsEvent: SnsEvent, protected dependency: Dependency) {
        this.snsInfo = {
            deviceId: snsEvent.id,
            adVastUrl: JSON.parse(snsEvent.message),
            time: snsEvent.time,
        }
    }

    async handle() {
        const flatEntry = await this.getFlatEntry();
        const trackingUrls = this.dependency.vastParser.parseUrls(flatEntry.vastString);

        return Promise.all([this.writeToDb(flatEntry), this.fireUrls(trackingUrls)]);
    }

    abstract getFlatEntry(): Promise<FlatEntry>;

    private writeToDb(flatEntry: FlatEntry): Promise<void> {
        return this.dependency.database.put(Transformer.flatToActual(flatEntry));
    }

    private fireUrls(urls: string[]) {
        return this.dependency.urlSender.fireTrackingUrls(urls);
    }
}


