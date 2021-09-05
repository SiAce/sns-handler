export enum SnsEventSubject {
    Started = "PLAYBACK_STARTED",
    Finished = "PLAYBACK_FINISHED",
}

export interface SnsInfo {
    subject: SnsEventSubject;
    deviceId: string;
    adVastUrl: string;
    time: number;
}

export interface SnsEvent {
    id: string,
    message: string,
    time: number,
    subject: string,
}