import { VASTParser } from 'vast-client';
import { DOMParser } from "xmldom";
import { Database } from "./sns/dependency/database/database";
import { SnsDependency } from "./sns/dependency/dependency";
import { UrlSender } from "./sns/dependency/tracking-url/url-sender";
import { SnsVastParser } from "./sns/dependency/vast/vast-parser";
import { SnsHandlerFactory } from "./sns/sns-handler-factory";
import { SnsEvent, SnsEventSubject } from "./sns/model";
import { DelegateHandler } from "./delegate-handler";


const database = new Database(process.env.tablename!);
const snsVastParser = new SnsVastParser(new DOMParser(), new VASTParser());
const urlSender = new UrlSender();

const dependency: SnsDependency = {
    database,
    snsVastParser: snsVastParser,
    urlSender
}

const snsHandlerFactory: SnsHandlerFactory = new SnsHandlerFactory(dependency);

const delegateHandler: DelegateHandler = new DelegateHandler(snsHandlerFactory);

export const handler = async (snsEvent: SnsEvent) => {
    return await delegateHandler.handle(snsEvent);
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