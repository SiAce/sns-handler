import { SnsEventHandler } from "./sns-event-handler";
import { SnsEvent } from "./sns-event";
import axios from "axios";
import { FlatEntry } from "src/dependency/database/model";

export class SnsStartHandler extends SnsEventHandler {
    override async getFlatEntry(): Promise<FlatEntry> {
        const axiosResponse = await axios.get<string>(this.snsInfo.adVastUrl);
        const vastString = axiosResponse.data;
        const adId = this.dependency.vastParser.parseId(vastString);
        const startTime = this.snsInfo.time;
        const ttl = startTime + 600;

        return {
            deviceId: this.snsInfo.deviceId,
            adId,
            vastString,
            startTime,
            endTime: undefined,
            ttl
        };
    }

}