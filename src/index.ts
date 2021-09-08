import { VASTParser } from 'vast-client';
import { DOMParser } from "xmldom";
import { Database } from "./sns/dependency/database/database";
import { Dependency } from "./sns/dependency/dependency";
import { UrlSender } from "./sns/dependency/tracking-url/url-sender";
import { SnsVastParser } from "./sns/dependency/vast/sns-vast-parser";
import { SnsHandler } from "./sns/sns-handler";
import { SnsHandlerFactory } from "./sns/sns-handler-factory";
import { SnsEvent, SnsEventSubject } from "./sns/sns-model";


const database = new Database(process.env.tablename!);
const snsVastParser = new SnsVastParser(new DOMParser(), new VASTParser());
const urlSender = new UrlSender();

const dependency: Dependency = {
    database,
    snsVastParser: snsVastParser,
    urlSender
}

const snsHandlerFactory: SnsHandlerFactory = new SnsHandlerFactory(dependency);

export const handler = async (snsEvent: SnsEvent) => {
    const snsHandler: SnsHandler = snsHandlerFactory.create(snsEvent);
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

handler(snsEvent).then(r => {
    console.log("SNS event handled, the response is:");
    console.log(r);
});