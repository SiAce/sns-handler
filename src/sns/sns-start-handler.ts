import { SnsInfo } from "@sns/sns-model";
import axios from "axios";
import { Ads, Entry } from "./dependency/database/model";
import { SnsHandlerBase } from "./sns-handler-base";

export class SnsStartHandler extends SnsHandlerBase {
    protected override async getEntry(snsInfo: SnsInfo): Promise<Entry> {
        const axiosResponse = await axios.get<string>(snsInfo.adVastUrl);
        const vastString = axiosResponse.data;
        const adIds = await this.dependency.snsVastParser.parseId(vastString);
        const ads: Ads = adIds.reduce((accumulator: Ads, currentValue) => {
            accumulator[currentValue] = {
                adBlob: vastString,
                startTime: snsInfo.time,
                endTime: undefined,
            };
            return accumulator;
        }, {});

        return {
            deviceId: snsInfo.deviceId,
            ads,
            ttl: snsInfo.time + 600
        };
    }
}