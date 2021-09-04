import { Database } from "./database/database";
import { UrlSender } from "./tracking-url/url-sender";
import { SnsVastParser } from "./vast/sns-vast-parser";


export interface Dependency {
    database: Database;
    snsVastParser: SnsVastParser;
    urlSender: UrlSender;
}