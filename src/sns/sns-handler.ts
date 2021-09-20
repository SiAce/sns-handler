import { SnsInfo } from "./model";

export interface SnsHandler {
    handle(snsInfo: SnsInfo): Promise<any>;
}