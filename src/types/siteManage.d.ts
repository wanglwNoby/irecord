interface ILocalMachine {
    system_id: number;
    site_id: number;
    site_name: string;
    description: string;
}
interface IServerDevice {
    system_id: number;
    site_id: number;
    ip_address: string;
    type: number;
    alias: string;
    guid: string;
    port: number;
    websocket_port: number;
    log_level: number;
    function_monitor: number;
    state: number;
    log_path: string;
}
interface IDatabase {
    system_id: number;
    site_id: number;
    type: number;
    ip_address: string;
    port: number;
    database_name: string;
    account: string;
    password: string;
    alias: string;
    state: number;
    character_set: string;
    database_key: string;
}
interface IStorage {
    system_id: number;
    site_id: number;
    guid: string;
    account: string;
    password: string;
    pattern: string;
    type: number;
    home_directory: string;
    alias: string;
    available_check: number;
    state: number;
    server_ip: string;
    port: number;
}
interface ILocalMachineInfo {
    params: {
        system_id: number;
    };
}
interface IRecordConfigInfo {
    params: {
        system_id: number;
        site_id: string;
    };
}
interface IRightOperation {
    params: {
        parent_id: string;
        resource_id: string;
    };
}
interface IMachineName {
    params: {
        server_ip: numb;
        server_port: number;
    };
}
interface IServerUid {
    params: {
        server_ip: string;
        server_port: number;
    };
}
interface IDeleteRecordConfig {
    params: {
        system_id: number;
        site_id: number;
        delete_code: string;
        key: string;
    };
}
interface IServerPort {
    server_ip: string;
    server_port: string;
    old_server_port: string;
}
interface ILogDirectory {
    server_ip: string;
    server_port: string;
    directory: string;
}
interface ILogGrade {
    server_ip: string;
    server_port: string;
    grade: string;
}
interface IDriver {
    params: {
        server_ip: string;
        server_port: string;
    };
}
interface IDirectory {
    params: {
        server_ip: string;
        server_port: string;
        directory: string;
    };
}