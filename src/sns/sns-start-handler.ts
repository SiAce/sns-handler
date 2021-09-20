import { SnsInfo } from "./model";
import axios from "axios";
import { Ads, Entry } from "./dependency/database/model";
import { SnsHandlerBase } from "./sns-handler-base";

export class SnsStartHandler extends SnsHandlerBase {
    protected override async getEntry(snsInfo: SnsInfo): Promise<Entry> {
        const axiosResponse = await axios.get<string>(snsInfo.adVastUrl);
        const vastString = axiosResponse.data;
        return await this.parseVastToEntry(vastString, snsInfo);
    }

    private async parseVastToEntry(vastString: string, snsInfo: SnsInfo): Promise<Entry> {
        const adIds = await this.dependency.snsVastParser.parseId(vastString);
        const ads: Ads = {};
        adIds.forEach((adId) => {
            ads[adId] = {
                adBlob: vastString,
                startTime: snsInfo.time,
                endTime: undefined,
            };
        });

        return {
            deviceId: snsInfo.deviceId,
            ads,
            ttl: snsInfo.time + 600
        };
    }
}
