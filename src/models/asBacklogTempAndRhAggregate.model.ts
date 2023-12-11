export interface AsBacklogTempAndRhAggregate {
    devId:    string;
    appId:    string;
    raw:      string;
    method:   string;
    params:   Params;
    metaData: MetaData;
}

export interface MetaData {
    time:             Date;
    frequency:        number;
    data_rate:        string;
    gateways:         Gateway[];
    data_rate_number: number;
    devClass:         string;
    joinId:           number;
    port:             number;
    seqno:            number;
    tags:             string;
    modulation:       string;
}

export interface Gateway {
    timestamp: Date;
    snr:       number;
    rssi:      number;
    gtw_id:    string;
    channel:   number;
}

export interface Params {
    options:         number;
    numReading:      number;
    timestamp:       number[];
    temperature:     number[];
    humidity:        number[];
    parsedTimestamp: Date[];
}
