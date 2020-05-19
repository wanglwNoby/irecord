interface IDBBridge {
    system_id: number;
    site_id: number;
    state: number;
    restful_port: number;
    websocket_port: number;
    log_level: number;
    alias: string;
    guid: string;
    alarm_push: number;
    restart_time: any;
    description: string;
}
interface IDBBridgeDatabase {
    system_id: number;
    site_id: number;
    state: number;
    db_bridge_id: number;
    description: string;
    database_key: number;
}
interface IDataBaseList {
    params: {
        site_id: number;
        system_id: number;
    };
}