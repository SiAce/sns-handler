import { Entry, Key } from "./model";

export class Database {
    constructor(private tablename: string) { }

    public async get(key: Key): Promise<Entry> {
        return {
            deviceId: "",
            ads: {
                1: {
                    adBlob: "",
                    startTime: 1,
                    endTime: 2,
                },
                2: {
                    adBlob: "what?",
                    startTime: 233,
                    endTime: 244,
                }
            },
            ttl: 123,
        }
    };

    public async put(entry: Entry): Promise<void> {
        console.log(
            `Entry saved:
            ${JSON.stringify(entry, null, 2)}`
        );
    };
}