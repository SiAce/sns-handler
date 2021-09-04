import { SnsEvent } from "./sns-event";

export interface SnsHandler {
    handle(snsEvent: SnsEvent): Promise<void>;
}