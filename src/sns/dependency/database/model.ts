export interface Key {
    deviceId: string
}

export interface Entry {
    deviceId: string,
    ads: Ads,
    ttl: number
}

export interface Ads {
    [adId: string]: AdEntry
}

export interface AdEntry {
    adBlob: string,
    startTime?: number,
    endTime?: number,
}

/*
start put
{
    deviceId: ${deviceId},
    ads: {
        ${parseFromVastString}: {
            adBlob: "${VastString}",
            startTime: ${time},
            endTime: undefined,
        }
    },
    ttl: ${time} + 600,
}


complete get

key: {
    ${deviceId}
}

{
    deviceId: #deviceIdDb,
    ads: {
        #adIdDB: {
            adBlob: #adBlobDB,
            startTime: #startTimeDB,
            endTime: undefined,
        }
    },
    ttl: #ttlDB,
}

complete put

{
    deviceId: ${deviceId},
    ads: {
        ${adIdDB}: {
            adBlob: ${adBlobDB},
            startTime: ${startTimeDB},
            endTime: ${time},
        }
    },
    ttl: ${time} + 600,
}

 */

