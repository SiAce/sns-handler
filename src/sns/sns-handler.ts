import { SnsEvent } from "@sns/model";

export interface SnsHandler {
    handle(snsEvent: SnsEvent): Promise<any>;
}