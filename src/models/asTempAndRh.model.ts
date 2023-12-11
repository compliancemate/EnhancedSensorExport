import { Method } from '../types/methods.types';
import { BasePayload } from './base-payload.model';

// export interface AsTempAndRh extends BasePayload {
//     method: typeof Method.asTempAndRh
//     params: {
//         temperature: number
//     }
// }


export interface AsTempAndRh  extends BasePayload {
    devId:    string;
    appId:    string;
    raw:      string;
    method:   typeof Method.asTempAndRh;
    params:   Params;
    metaData: MetaData;
}

export interface MetaData {
    time:             Date;
    frequency:        number;
    data_rate:        string;
    consumed_airtime: string;
    gateways:         Gateway[];
    confirmed:        boolean;
    f_port:           number;
    f_cnt:            number;
    received_at:      Date;
    modulation:       string;
}

export interface Gateway {
    timestamp:      number;
    time:           Date;
    snr:            number;
    rssi:           number;
    channel_rssi:   number;
    gtw_id:         string;
    usingPktBroker: boolean;
}

export interface Params {
    alarmMsgCount:   number;
    backlogMsgCount: number;
    batteryCapacity: number;
    options:         number;
    temperature:     number;
    humidity:        number;
    serverTimestamp: Date;
}