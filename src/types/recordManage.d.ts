interface IGetColumns {
    params: {
        view_id: string;
        type: string;
    };
}

interface ISaveSetting {
    save_setting: string;
}

interface IRightOperation {
    params: {
        parent_id: string;
        resource_id: string;
    };
}

interface IQueryRecord2 {
    params: {
        query_id: string;
        page_index: number;
        page_size: number;
    };
}

interface IQueryRecord {
    begin: string;
    end: string;
    min_time: number;
    max_time: number;
    agent: string;
    extension: string;
    channel: string;
    caller: string;
    called: string;
    call_direction: number;
    page_size: number;
    page_index: number;
    invalid_records: number;
    dtmf: string;
    /* function_id: string; */
}

interface IExportRecord {
    ids: string[];
}

interface IPlay {
    system_id: string;
}

interface IExport {
    query_id: string;
    page_index: number;
    page_size: number;
}

interface IRecordKeyword {
    content: string;
    content_remark: string;
    is_show: number;
    keyword_group_id: string;
    keyword_id: string;
    offset_time: string;
    media_id: string;
    record_time_lenth: string;
    time_length: string;
    trust_degree: string;
    type: number;
    system_id?: string;
    tagging_person?: string;
    tagging_time?: string;
}

interface IDeleteRecordKeyword {
    system_id: string;
    media_id: string;
    keyword_id: string;
}

interface ISelectRecordKeyword {
    params: {
        media_id: string;
    };
}

interface IMark {
    userId?: long;
    type?: number;
    record_id?: long;
    create_time?: long;
    offset_time?: double;
    offset_length?: double;
    oldoffset_time?: double;
    title?: string;
    content?: string;
    operation_type?: number;
}