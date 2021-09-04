import { Database } from "./dependency/database/database";
import { Dependency } from "./dependency/dependency";
import { UrlSender } from "./dependency/tracking-url/url-sender";
import { VastParser } from "./dependency/vast/vast-parser";
import { SnsEvent } from "./sns/sns-event";
import { SnsEventHandler } from "./sns/sns-event-handler";
import { SnsEventHandlerFactory } from "./sns/sns-event-handler-factory";

const database = new Database(process.env.tablename!);
const vastParser = new VastParser();
const urlSender = new UrlSender();

const dependency: Dependency = {
    database,
    vastParser,
    urlSender
}

export const handler = async (snsEvent: SnsEvent) => {
    const snsEventHandler: SnsEventHandler = SnsEventHandlerFactory.create(snsEvent, dependency);
    return await snsEventHandler.handle();
}