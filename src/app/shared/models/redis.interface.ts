export interface RedisResponse {
    command?: string;
    output?: string;
    status?: 'ok';
}
export interface RedisRequest {
    command?: string;
    sessionId?: string; // UUID
    date?: number;
}
export type RedisWebsocket = RedisRequest | RedisResponse;
