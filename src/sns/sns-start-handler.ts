import axios from "axios";
import { FlatEntry } from "./dependency/database/model";
import { SnsHandlerBase } from "./sns-handler-base";
import { SnsInfo } from "./sns-info";

export class SnsStartHandler extends SnsHandlerBase {
    override async getFlatEntry(snsInfo: SnsInfo): Promise<FlatEntry> {
        const axiosResponse = await axios.get<string>(snsInfo.adVastUrl);
        const vastString = axiosResponse.data;
        const adId = this.dependency.vastParser.parseId(vastString);
        const startTime = snsInfo.time;
        const ttl = startTime + 600;

        return {
            deviceId: snsInfo.deviceId,
            adId,
            vastString,
            startTime,
            endTime: undefined,
            ttl
        };
    }

}