interface IRightOperation {
    params: {
        parent_id: string;
        resource_id: string;
    };
}

interface IGetColumns {
    params: {
        view_id: string;
        type: string;
    };
}

interface IGetDailyCallForm {
    time?: string;
    type?: string;
    extension?: string[];
    min_time?: number;
    max_time?: number;
    begin?: string;
    end?: string;
    report_number: number;
    query_type?: number;
    user_id?: string[];
    department?: string;
    custom?: string;
    page_size?: number;
}
interface IExportExtensionCall {
    query_id: string;
    picture: string;
}
interface IQueryOrg {
    params: {
        parent_org_id: string;
    };
}
interface IDownloadPlay {
    record_id: long[];
    type: number;
    user_id?: long;
    operate_Time?: long;
    last_time: long;
    savePath?: string;
}

interface IExportPlayback {
    query_id: string;
    page_index: number;
    page_size: number;
}

interface IExportDownload {
    query_id: string;
    page_index: number;
    page_size: number;
}

interface IGetDailyCallForm2 {
    params: {
        query_id: string;
        page_index: number;
        page_size: number;
    };
}

interface IQueryDepart {
    params: {
        type: number;
    };
}

interface INewRoleFo {
    params: {
        module_id: string;
    };
}

interface IGetOperationLog {
    begin: string;
    end: string;
    userId?: string;
    result?: string;
    operationId?: string;
    page_size: int;
}

interface IGetOperationLog2 {
    params: {
        query_id: string;
        page_index: number;
        page_size: number;
    };
}