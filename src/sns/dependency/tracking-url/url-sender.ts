import axios from "axios";


export class UrlSender {
    public fireTrackingUrls(urls: string[]) {
        console.log(`Sending Tracking URLS:
            ${JSON.stringify(urls, null, 2)}`);
        return Promise.all(urls.map((url) => axios.get<void>(url)));
    }
}