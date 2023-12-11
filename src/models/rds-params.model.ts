export interface RDSParams {
    host: string;   
    database: string;   
    port: number;   
    user: string;   
    password: string;
    connectionTimeoutMillis?: number;
    idleTimeoutMillis?: number;
    query_timeout?: number;
}