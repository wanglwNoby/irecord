import * as React from 'react'
import intl from 'react-intl-universal'
import moment from 'moment'
import { Badge } from 'antd'

interface IDataItem {
    col_id: string;
    display: string;
    col_name: string;
    view_width: number;
}
interface IColumns {
    key: string;
    title: string;
    dataIndex: string;
    width: number;
    ellipsis?: boolean;
    fixed?: string;
    render?: (text: any, record?: any, index?: number) => React.ReactElement | string;
}

// 获取表格宽度
export function setWidth(columns: IColumns[]): number {
    let width = 0
    columns.forEach((item: IColumns): void => {
        width += item.width
    })
    return width
}

// format表格头
export function formatColumns(data: IDataItem[]): IColumns[] {
    const columns: IColumns[] = []

    // render时间
    const timeFormat = (text: string): any => {
        if (text !== '') {
            return moment(text, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
        }
        return ''
    }

    // 呼叫方向
    const callDirection = (text: string): string => {
        switch (text) {
            case '73':
                return intl.get('COM001007001V73').d('呼入')
            case '79':
                return intl.get('COM001007001V79').d('呼出')
            default:
                return ''
        }
    }

    // 是否已删除
    const renderIsDeleted = (text: string): string => {
        switch (text) {
            case '0':
                return intl.get('M26P102261011010000PS001').d('未删除')
            case '1':
                return intl.get('M26P102261011010000PS002').d('已删除')
            default:
                return ''
        }
    }

    // 类别
    const renderType = (text: string): string => {
        switch (text) {
            case '1001':
                return intl.get('BDN0002111201001').d('服务告警')
            case '1002':
                return intl.get('BDN0002111201002').d('通讯告警')
            case '1003':
                return intl.get('BDN0002111201003').d('时长告警')
            case '1004':
                return intl.get('BDN0002111201004').d('设备告警')
            case '1005':
                return intl.get('BDN0002111201005').d('资源告警')
            case '1006':
                return intl.get('BDN0002111201006').d('状态告警')
            default:
                return text
        }
    }

    // 等级
    const renderDegree = (text: number): number | React.ReactElement => {
        switch (text) {
            case 0:
                return <span>{intl.get('BDN000211107000').d('未知')}</span>
            case 1:
                return <span style={{ color: 'blue' }}>{intl.get('BDN000211107001').d('提示')}</span>
            case 2:
                return <span style={{ color: 'yellow' }}>{intl.get('BDN000211107002').d('次要')}</span>
            case 3:
                return <span style={{ color: 'orange' }}>{intl.get('BDN000211107003').d('重要')}</span>
            case 4:
                return <span style={{ color: 'red' }}>{intl.get('BDN000211107004').d('紧急')}</span>
            case 5:
                return <span style={{ color: '#990066' }}>{intl.get('BDN000211107005').d('灾难')}</span>
            default:
                return text
        }
    }

    // 来源
    const renderSource = (text: number): number | string => {
        switch (text) {
            case 260101:
                return intl.get('BDN000211121260101').d('录音服务')
            case 261101:
                return intl.get('BDN000211121261101').d('DBBridge服务')
            default:
                return text
        }
    }

    const renderStatus = (text: string): any => {
        switch (text) {
            case '1':
                return <Badge color="#708090" text={intl.get('BDN260212605001').d('空闲')} />
            case '5':
                return <Badge color="#7cfc00" text={intl.get('BDN260212605005').d('通话')} />
            case '101':
                return <Badge color="#ffa500" text={intl.get('BDN260212605101').d('振铃')} />
            case '901':
                return <Badge color="#8b0000" text={intl.get('BDN260212605901').d('断线')} />
            case '902':
                return <Badge color="#ba55d3" text={intl.get('BDN260212605902').d('未知')} />
            default:
                return text
        }
    }

    // 报表显示百分比
    const renderCountPercent = (text: string): any => (<span>{`${text}%`}</span>)

    data.forEach((item: IDataItem): void => {
        columns.push({
            key: item.col_name,
            title: item.display,
            dataIndex: item.col_name,
            width: item.view_width,
            ellipsis: true,
            render: (text: any, _record: any, index: number): any => {
                switch (item.col_name) {
                    case 'OrderID':
                        return index + 1
                    case 'StartTime':
                    case 'StopTime':
                    case 'CstTime':
                    case 'CallBegin':
                    case 'OperationTime':
                    case 'LogTime':
                        return timeFormat(text)
                    case 'Direction':
                        return callDirection(text)
                    case 'IsDeleted':
                        return renderIsDeleted(text)
                    case 'Type':
                        return renderType(text)
                    case 'Degree':
                        return renderDegree(text)
                    case 'Source':
                        return renderSource(text)
                    case 'Status':
                        return renderStatus(text)
                    case 'CountPercent':
                        return renderCountPercent(text)
                    default:
                        return text
                }
            }
        })
    })
    return columns
}