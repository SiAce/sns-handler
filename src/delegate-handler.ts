import { SnsEvent, SnsEventSubject, SnsInfo } from "./sns/model";
import { SnsHandler } from "./sns/sns-handler";
import { SnsHandlerFactory } from "./sns/sns-handler-factory";

export class DelegateHandler {
    constructor(private snsHandlerFactory: SnsHandlerFactory) {};

    public async handle(snsEvent: SnsEvent) {
        const snsHandler: SnsHandler = this.snsHandlerFactory.create(snsEvent);
        return await snsHandler.handle(DelegateHandler.eventToInfo(snsEvent));
    }

    private static eventToInfo(snsEvent: SnsEvent): SnsInfo {
        if (!this.isSupportedSubject(snsEvent.subject)) {
            throw new Error("SNS subject not supported!");
        }

        const adVastUrl = JSON.parse(snsEvent.message).url;

        if (!(typeof adVastUrl === "string")) {
            throw new Error("The VAST URL for Ad in SNS message is not valid string!");
        }

        return {
            subject: snsEvent.subject,
            deviceId: snsEvent.id,
            adVastUrl,
            time: snsEvent.time,
        }
    }

    private static isSupportedSubject(subject: string): subject is SnsEventSubject {
        return Object.values(SnsEventSubject).includes(subject as SnsEventSubject);
    }
}