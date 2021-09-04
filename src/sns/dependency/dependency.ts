import { Database } from "./database/database";
import { UrlSender } from "./tracking-url/url-sender";
import { VastParser } from "./vast/vast-parser";


export interface Dependency {
    database: Database;
    vastParser: VastParser;
    urlSender: UrlSender;
}