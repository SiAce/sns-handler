import { Dependency } from "./dependency/dependency";
import { SnsEvent } from "./sns-event";
import { SnsEventSubject } from "./sns-event-subject";
import { SnsFinishHandler } from "./sns-finish-handler";
import { SnsHandler } from "./sns-handler";
import { SnsStartHandler } from "./sns-start-handler";

export class SnsHandlerFactory {
    private strategyMap: Map<SnsEventSubject, SnsHandler>;

    constructor(dependency: Dependency) {
        const snsStartHandler: SnsStartHandler = new SnsStartHandler(dependency);
        const snsFinishHandler: SnsFinishHandler = new SnsFinishHandler(dependency);

        this.strategyMap = new Map<SnsEventSubject, SnsHandler>([
            [SnsEventSubject.Started, snsStartHandler],
            [SnsEventSubject.Finished, snsFinishHandler],
        ]);
    }

    public create(snsEvent: SnsEvent): SnsHandler | undefined {
        return this.strategyMap.get(snsEvent.subject as SnsEventSubject);
    }
}