import { SnsEventSubject } from "./sns-event-subject";

export interface SnsInfo {
    subject: SnsEventSubject;
    deviceId: string;
    adVastUrl: string;
    time: number;
}