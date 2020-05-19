interface IChannel {
    site_id: number;
    record_service_id: number;
    recorder_id: number;
    channel_id: number;
    channel_name: string;
    extension_id: number;
    phone_ip: number;
    phone_port: number;
    start_mode: number;
    start_dtmf: string;
    stop_dtmf: string;
    record_file_code: number;
    coding_format: number;
    min_record_duration: string;
    max_record_duration: string;
    cutting_record: number;
    choice_record: number;
    record_time_range: string;
    description: string;
    channel_count: number;
    double_track: number;
}
interface IDeleteChannel {
    params: {
        recorder_id: number;
        site_id: number;
        record_service_id: number;
        channel_id: number;
    };
}
interface IGetChannel {
    params: {
        site_id: number;
        record_service_id: number;
    };
}
interface IRecordFile {
    recorder_id: number;
    site_id: number;
    record_service_id: number;
    storage_device_id: number;
    try_file_count: number;
    file_time_slot: any;
    route_config: number;
    state: number;
    description: string;
    operation_type: number;
}
interface IDownload {
    recorder_id: number;
    site_id: number;
    record_service_id: number;
    serial_number: nunmber;
    drive_letter: number;
    download_type: number;
    address: string;
    port: number;
    account: string;
    password: string;
    directory: string;
    pattern_type: number;
    description: string;
}
interface IGetDownload {
    params: {
        site_id: number;
        record_service_id: number;
    };
}
interface IDeleteDownload {
    params: {
        recorder_id: number;
        site_id: number;
        record_service_id: number;
        serial_number: number;
    };
}
interface IGetRecordFile {
    params: {
        site_id: number;
        record_service_id: number;
    };
}
interface IDeleteRecordFile {
    params: {
        recorder_id: number;
        site_id: number;
        record_service_id: number;
        storage_device_id: number;
    };
}
interface IDelete {
    recorder_id: number;
    site_id: number;
    record_service_id: number;
    delete_method: number;
    delete_config: number;
    retention_days: number;
    delete_database: number;
    locked_record: number;
    description: '';
    state: number;
}
interface IGetDelete {
    params: {
        site_id: number;
        record_service_id: number;
    };
}