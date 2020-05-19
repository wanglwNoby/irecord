interface IServerService {
    params: {
        server_ip: string;
        server_port: string;
    };
}
interface INoticeParamUpdate {
    params: {
        server_ip: string;
        server_port: string;
    };
}
interface IServerRestart {
    ip: string;
    port: string;
    server_restart_list: {
        service_type: string;
        operation: string;
        opTime: string;
    }[];
}