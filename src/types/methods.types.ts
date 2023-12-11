export const Method =  {
    asTempAndRh: 'asTempAndRh',
    asTempAndRhAggregate: 'asTempAndRhAggregate',
    asBacklogTempAndRh: 'asBacklogTempAndRh',
    asBacklogTempAndRhAggregate: 'asBacklogTempAndRhAggregate',
} as const;

export type Method = typeof Method[keyof typeof Method]