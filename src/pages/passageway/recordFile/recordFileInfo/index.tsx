import * as React from 'react'
import { Table } from 'antd'
import intl from 'react-intl-universal'
import styles from './index.module.less'

class RecordFileInfo extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            activeRow: {},
            columns: [
                {
                    title: `${intl.get('M26P102261011090100MT003').d('存储设备')}`,
                    dataIndex: 'storagedeviceid',
                    key: 'storagedeviceid'
                },
                {
                    title: `${intl.get('M26P102261011091100ML009').d('尝试归档次数')}`,
                    dataIndex: 'tryfilecount',
                    key: 'tryfilecount'
                },
                {
                    title: `${intl.get('M26P102261011091100ML010').d('归档时间段')}`,
                    dataIndex: 'filetimeslot',
                    key: 'filetimeslot'
                },
                {
                    title: `${intl.get('M26P102261011091100ML011').d('保持原始路径方式')}`,
                    dataIndex: 'routeconfig',
                    key: 'routeconfig',
                    render: (text: any): React.ReactElement => {
                        switch (text) {
                            case 1:
                                return <span>{intl.get('M26P102261011091100ML012').d('原始路径+文件')}</span>
                            default:
                                return <span>{intl.get('M26P102261011091100ML013').d('只是文件')}</span>
                        }
                    }
                },
                {
                    title: `${intl.get('M26P102261011090500ML007').d('启用状态')}`,
                    dataIndex: 'state',
                    key: 'state',
                    render: (text: any): React.ReactElement => {
                        switch (text) {
                            case 1:
                                return <span>{intl.get('COM001002002V1').d('启用')}</span>
                            default:
                                return <span>{intl.get('COM001002002V0').d('禁用')}</span>
                        }
                    }
                }
            ]
        }
    }

    public componentDidMount(): void {
        console.log(this.props)
    }

    public clickRow = (record): any => ({
        onClick: (): any => {
            console.log(record)
            this.setState({ activeRow: record })
            this.props.recordFIleInfo(record)
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
                <div style={{ marginTop: '20px', marginLeft: '30px', textAlign: 'center' }}>{intl.get('M26P102261011091100PF002').d('归档信息')}</div>
                <div>
                    <Table
                        onRow={this.clickRow}
                        rowClassName={this.setRowClassName}
                        dataSource={data}
                        columns={this.state.columns}
                        pagination={false}
                    />
                    {/* <Row style={{ marginTop: '40px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            录音厂商ID:
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo[0] && this.props.dataInfo[0].recorderId}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            存储设备编号:
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo[0] && this.props.dataInfo[0].storageDeviceId}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            尝试归档次数:
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo[0] && this.props.dataInfo[0].tryFileCount}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            归档时间段:
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo[0] && this.props.dataInfo[0].fileTimeSlot}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            是否保持原始路径:
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo[0] && this.props.dataInfo[0].routeConfig === 1 ? '原始路径+文件' : '只是文件'}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            状态：
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.state === 1 ? '启用' : '禁用'}
                        </Col>
                    </Row> */}
                </div>
            </div>
        )
    }
}


export default RecordFileInfo