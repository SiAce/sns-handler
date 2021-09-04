import axios from "axios";


export class UrlSender {
    public fireTrackingUrls(urls: string[]) {
        return Promise.all(urls.map((url) => axios.get<void>(url)));
    }
}