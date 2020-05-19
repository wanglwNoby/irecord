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

interface IQueryMessage {
    begin: string;
    end: string;
    degree: string[];
    host: string[];
    type: string[];
    source: string[];
    page_size: number;
    page_index: number;
    lang_id: string;
    module: number;
}

interface IQueryMessage2 {
    params: {
        query_id: string;
        page_size: number;
        page_index: number;
    };
}

interface IExportMessage {
    query_id: string;
    page_size: number;
    page_index: number;
}

interface IGetWebsocketUrl {
    params: {
        server_id: string;
    };
}