import { SnsEvent } from "@sns/sns-model";

export interface SnsHandler {
    handle(snsEvent: SnsEvent): Promise<void>;
}