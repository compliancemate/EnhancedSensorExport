export interface LocationAspect {
    storeName: string;
    locationId: number;
    address: string;
    city: string;
    title: string;
    aliasName: string;
    minimum: number;
    maximum: number;
}

export interface MeasureAspect {
    timeStamp: Date;
    sensorName: string;
    temperature: number;
    batteryCapacity?: number;
}


export type ExportPackage = LocationAspect & MeasureAspect

