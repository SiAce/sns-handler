import { VASTParser } from "vast-client";
import { TrackingUrlType } from "../tracking-url/type";

export class SnsVastParser {
    constructor(
        private domParser: DOMParser,
        private vastParser: VASTParser,
    ) { }

    public async parseUrls(vastString: string, trackingUrlType: TrackingUrlType) {
        const vastXml = this.domParser.parseFromString(vastString, "text/xml");
        const vastResponse = await this.vastParser.parseVAST(vastXml);
        const trackingUrls = vastResponse.ads[0].creatives[0].trackingEvents[trackingUrlType];
        return trackingUrls;
    }

    public async parseId(vastString: string): Promise<string[]> {
        const vastXml = this.domParser.parseFromString(vastString, "text/xml");
        const vastResponse = await this.vastParser.parseVAST(vastXml);
        return vastResponse.ads.map((ad) => ad.id!);
    }
}