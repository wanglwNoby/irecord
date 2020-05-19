import * as React from 'react'
import { Table } from 'antd'
import intl from 'react-intl-universal'
import styles from './index.module.less'

class DownloadInfo extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            columns: [
                {
                    title: '#',
                    dataIndex: 'SerialNumber',
                    key: 'SerialNumber'
                },
                {
                    title: `${intl.get('M26P102261011091100ML023').d('盘符')}`,
                    dataIndex: 'DriveLetter',
                    key: 'DriveLetter'
                },
                {
                    title: `${intl.get('M26P102261011091100ML022').d('文件下载方式')}`,
                    dataIndex: 'DownloadType',
                    key: 'DownloadType',
                    render: (text: any): React.ReactElement => {
                        switch (text) {
                            case 101:
                                return <span>http</span>
                            case 102:
                                return <span>https</span>
                            case 201:
                                return <span>ftp</span>
                            default:
                                return <span>sftp</span>
                        }
                    }
                },
                {
                    title: `${intl.get('M26P102261011090100ML011').d('所在服务器')}`,
                    dataIndex: 'Address',
                    key: 'Address'
                },
                {
                    title: `${intl.get('M26P102261011090100ML015').d('端口')}`,
                    dataIndex: 'Port',
                    key: 'Port'
                },
                {
                    title: `${intl.get('M26P102261011090100ML016').d('登录账号')}`,
                    dataIndex: 'Account',
                    key: 'Account'
                },
                {
                    title: `${intl.get('M26P102261011091100ML024').d('路径')}`,
                    dataIndex: 'Directory',
                    key: 'Directory'
                }
            ],
            activeRow: {}
        }
    }

    public componentDidMount(): void {
        console.log(this.props)
    }

    public clickRow = (record): any => ({
        onClick: (): any => {
            this.setState({ activeRow: record })
            this.props.downloadInfo(record)
        }
    })

    public setRowClassName = (record): any => (record.key === this.state.activeRow.key ? 'clickRow' : '')

    public render(): React.ReactElement {
        const data = []
        if (this.props.dataInfo) {
            for (const item of this.props.dataInfo) {
                item.key = `${Math.floor(Math.random() * 10000000)}`
                data.push(item)
            }
        }
        return (
            <div className={styles.basicInfo}>
                <div style={{ marginTop: '20px', marginLeft: '30px', textAlign: 'center' }}>{intl.get('M26P102261011091100PF004').d('下载信息')}</div>
                <div className={styles.basicInfo}>
                    <Table
                        onRow={this.clickRow}
                        rowClassName={this.setRowClassName}
                        dataSource={data}
                        columns={this.state.columns}
                        pagination={false}
                    />
                </div>
            </div>
        )
    }
}


export default DownloadInfo