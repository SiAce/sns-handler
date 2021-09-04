import { SnsEvent } from "./sns-event";
import { SnsEventSubject } from "./sns-event-subject";
import { SnsStartHandler } from "./sns-start-handler";
import { SnsFinishHandler } from "./sns-finish-handler";
import { Database } from "src/dependency/database/database";
import { Dependency } from "src/dependency/dependency";

export class SnsEventHandlerFactory {
    public static create(snsEvent: SnsEvent, dependency: Dependency) {
        switch (snsEvent.subject) {
            case SnsEventSubject.Started:
                return new SnsStartHandler(snsEvent, dependency);
            case SnsEventSubject.Finished:
                return new SnsFinishHandler(snsEvent, dependency);
            default:
                throw new Error("Subject not supported");
        }
    }
}