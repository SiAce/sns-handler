import { Database } from "./database/database";
import { UrlSender } from "./tracking-url/url-sender";
import { SnsVastParser } from "./vast/vast-parser";


export interface SnsDependency {
    database: Database;
    snsVastParser: SnsVastParser;
    urlSender: UrlSender;
}