import { Method } from '../types/methods.types';
import { BasePayload } from './base-payload.model';

export interface AsBacklogTempAndRh extends BasePayload{
    devId:    string;
    appId:    string;
    raw:      string;
    method:   typeof Method.asBacklogTempAndRh
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
    timestamp:       number;
    options:         number;
    temperature:     number;
    humidity:        number;
    parsedTimestamp: Date;
}
