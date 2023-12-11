import { Method } from '../types/methods.types';


export interface BasePayload {
    appId: string;
    devId: string;
    method: Method
    metaData: any;
    params: any;
    raw: string
    redis?: any
}