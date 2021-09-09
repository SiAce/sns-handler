import { SnsInfo } from "@sns/model";

export interface SnsHandler {
    handle(snsInfo: SnsInfo): Promise<any>;
}