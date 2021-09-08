import { SnsDependency } from "./dependency/dependency";
import { SnsFinishHandler } from "./sns-finish-handler";
import { SnsHandler } from "./sns-handler";
import { SnsEvent, SnsEventSubject } from "./model";
import { SnsStartHandler } from "./sns-start-handler";

export class SnsHandlerFactory {
    private strategyMap: Map<SnsEventSubject, SnsHandler>;

    constructor(dependency: SnsDependency) {
        this.strategyMap = new Map<SnsEventSubject, SnsHandler>([
            [SnsEventSubject.Started, new SnsStartHandler(dependency)],
            [SnsEventSubject.Finished, new SnsFinishHandler(dependency)],
        ]);
    }

    public create(snsEvent: SnsEvent): SnsHandler {
        const snsHandler = this.strategyMap.get(snsEvent.subject as SnsEventSubject);
        if (snsHandler === undefined) {
            throw new Error("SNS subject not supported!");
        }
        return snsHandler;
    }
}