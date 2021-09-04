import { Database } from "./sns/dependency/database/database";
import { Dependency } from "./sns/dependency/dependency";
import { UrlSender } from "./sns/dependency/tracking-url/url-sender";
import { VastParser } from "./sns/dependency/vast/vast-parser";
import { SnsEvent } from "./sns/sns-event";
import { SnsEventSubject } from "./sns/sns-event-subject";
import { SnsHandler } from "./sns/sns-handler";
import { SnsHandlerFactory } from "./sns/sns-handler-factory";

const database = new Database(process.env.tablename!);
const vastParser = new VastParser();
const urlSender = new UrlSender();

const dependency: Dependency = {
    database,
    vastParser,
    urlSender
}

const snsHandlerFactory: SnsHandlerFactory = new SnsHandlerFactory(dependency);

export const handler = async (snsEvent: SnsEvent) => {
    const snsHandler: SnsHandler | undefined = snsHandlerFactory.create(snsEvent);
    if (snsHandler === undefined) {
        throw new Error("Subject not supported");
    }
    return await snsHandler.handle(snsEvent);
}

const snsEvent: SnsEvent = {
    id: "8282828",
    message: `{
        "url": "https://raw.githubusercontent.com/InteractiveAdvertisingBureau/VAST_Samples/master/VAST%204.2%20Samples/Ad_Verification-test.xml",
        "message": "asdfasdf"
    }`,
    time: 777,
    subject: SnsEventSubject.Started
};

handler(snsEvent);