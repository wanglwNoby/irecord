interface ILicence {
    system_id: number;
    site_id: number;
    licence_id: number;
    main_standby: number;
    restful_port: number;
    websocket_port: number;
    alias: string;
    guid: number;
    description: string;
    state: number;
    alarm_push: number;
}
interface IMonitor {
    system_id: number;
    site_id: number;
    restful_port: number;
    websocket_port: number;
    alias: string;
    guid: number;
    state: number;
}
interface IFileDelete {
    system_id: number;
    site_id: number;
    restful_port: number;
    websocket_port: number;
    alias: string;
    guid: number;
    state: number;
    file: number;
    delete: number;
}
interface IRecord {
    system_id: number;
    site_id: number;
    master_id: number;
    restful_port: number;
    websocket_port: number;
    record_type: number;
    start_delay: number;
    concurrent_channel: number;
    max_mute_duration: string;
    min_record_duration: string;
    max_record_duration: string;
    media_format: number;
    storage_device: string;
    alias: string;
    db_bridge_id: string;
    hash_check_code: string;
    stream_buffer: string;
    guid: number;
    push_stream: number;
    filing_months: number;
    alarm_push: number;
    start_archive: number;
    start_delete: number;
    description: string;
    log_level: number;
    state: number;
    less_than_record_time: number;
    more_than_record_time: number;
    gate_way_one: string;
    gate_wayT_two: string;
    gate_way_three: string;
    gate_way_four: string;
    gate_way_five: string;
    gate_way_six: string;
    gate_way_seven: string;
    gate_way_eight: string;
    gate_way_nine: string;
    gate_way_ten: string;
}
interface IMasterServer {
    params: {
        site_id: number;
        device_id: number;
    };
}