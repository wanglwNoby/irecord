import * as React from 'react'
import { connect } from 'react-redux'
import intl from 'react-intl-universal'
import moment, { Moment } from 'moment'
import { Table, Row, Col, DatePicker, Select, message, Radio, Pagination, Drawer } from 'antd'
import { RangePickerValue } from 'antd/lib/date-picker/interface'
import DraggableModal from '../../../components/cores/draggableModal/draggableModal'
import RightOperation from '../../../components/containers/right-operation/rightOperation'
import { formatColumns } from '../../../utils/tableUtil'
import { _getRightOperation, _getColumns, _getSelectList, _queryMessage, _queryMessage2, _exportMessage, _serverList } from '../../../common/api/queryStatistics'
import styles from './abnormalInfo.module.less'

interface IState {
    tableHeight: number; // table滚动高度
    visible: boolean; // 显示开关
    drawerVisible: boolean; // 详情抽屉开关
    exportVisible: boolean; // 导出显示开关
    columns: any[]; // 表头
    dataSource: any[]; // 表数据
    rightOperationData: any[]; // 右侧按钮
    degreeList: any[]; // 消息等级列表
    serverList: any[]; // 服务器设备列表
    typeList: any[]; // 消息类型列表
    sourceList: any[]; // 消息来源列表
    rangeTime: RangePickerValue; // 时间段
    degree: string[]; // 消息等级
    serverID: string[]; // 服务器设备
    type: string[]; // 消息类别
    source: string[]; // 消息来源
    queryKey: string; // 查询记录
    total: number; // 总条数
    pageSize: number; // 每页条数
    pageIndex: number; // 当前页码
    exportType: number; // 导出方式
    selectedRowKeys: string[] | number[]; // 选中的行keys
    selectedRows: any; // 选中的行数据
    [key: string]: any;
}

class AbnormalInfo extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            tableHeight: 0,
            visible: false,
            drawerVisible: false,
            exportVisible: false,
            columns: [],
            dataSource: [],
            rightOperationData: [],
            degreeList: [],
            serverList: [],
            typeList: [],
            sourceList: [],
            rangeTime: [moment().startOf('day'), moment().endOf('day')],
            degree: ['-1'],
            serverID: ['0'],
            type: ['0'],
            source: ['0'],
            queryKey: '',
            total: 0,
            pageSize: 50,
            pageIndex: 1,
            exportType: 1,
            selectedRowKeys: [],
            selectedRows: {}
        }
    }

    public componentDidMount(): void {
        const abnormalInfo = document.querySelectorAll('#abnormalInfo')[0]
        this.setState({
            tableHeight: abnormalInfo.getBoundingClientRect().height - 102
        })
        this.getColumns()
        this.getRightOperation('')
        this.getDegreeList()
        this.getServerList()
        this.getTypeList()
        this.getSourceList()
    }

    // 获取表头数据
    public getColumns = async (): Promise<void> => {
        const res: any = await _getColumns({
            params: {
                view_id: '9112650110100000000',
                type: '0'
            }
        })
        if (res && res.result) {
            const columns = formatColumns(res.data)
            this.setState({ columns })
        }
    }

    // 获取右侧菜单
    public getRightOperation = async (id: string): Promise<void> => {
        const res: any = await _getRightOperation({
            params: {
                parent_id: '1022610110522000000',
                resource_id: id
            }
        })
        if (res && res.result) {
            const rightOperation = res.data[0].P004
            this.setState({
                rightOperationData: rightOperation
            })
        }
    }

    // 获取消息等级
    public getDegreeList = async (): Promise<void> => {
        const res: any = await _getSelectList({
            params: { parent_code: '1107' }
        })
        if (res && res.result) {
            this.setState({
                degreeList: res.data
            })
        }
    }

    // 获取服务器列表
    public getServerList = async (): Promise<void> => {
        const res: any = await _serverList()
        if (res && res.result && res.data.length > 0) {
            this.setState({
                serverList: res.data
            })
        }
    }

    // 获取消息类别
    public getTypeList = async (): Promise<void> => {
        const res: any = await _getSelectList({
            params: { parent_code: '1120' }
        })
        if (res && res.result) {
            this.setState({
                typeList: res.data
            })
        }
    }

    // 获取消息来源
    public getSourceList = async (): Promise<void> => {
        const res: any = await _getSelectList({
            params: { parent_code: '1121' }
        })
        if (res && res.result) {
            this.setState({
                sourceList: res.data
            })
        }
    }

    public rightIdData = (data: any): void => {
        switch (data.P003) {
            case 'OP102261011052201':
                this.setState({
                    visible: true
                })
                break
            case 'OP102261011052209':
                if (this.state.dataSource.length === 0) {
                    message.error(intl.get('M26P102261011051100PM002').d('当前没有数据导出'))
                    return
                }
                this.setState({
                    exportVisible: true
                })
                break
            case 'OP102261011052203':
                this.setState({
                    drawerVisible: true
                })
                break
            default:
                break
        }
    }

    public handleSelectChange = (key: string, value: string[]): void => {
        if (value[0] === '0' && value.length > 1) {
            value.splice(0, 1)
            this.setState({ [key]: value })
        } else if (value.includes('0')) {
            this.setState({ [key]: ['0'] })
        } else {
            this.setState({ [key]: value })
        }
    }

    public handleDegreeSelectChange = (key: string, value: string[]): void => {
        if (value[0] === '-1' && value.length > 1) {
            value.splice(0, 1)
            this.setState({ [key]: value })
        } else if (value.includes('-1')) {
            this.setState({ [key]: ['-1'] })
        } else {
            this.setState({ [key]: value })
        }
    }

    // 导出功能
    public export = async (): Promise<void> => {
        const data: any = {
            query_id: this.state.queryKey,
            page_size: this.state.total,
            page_index: 1
        }
        if (this.state.exportType === 1) {
            data.page_size = this.state.pageSize
            data.page_index = this.state.pageIndex
        }
        const res: any = await _exportMessage(data)
        this.setState({ exportVisible: false })
        const blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
        this.exportExcel(blob)
    }

    // 导出方式
    public exportExcel = (blob: Blob): void => {
        const link = document.createElement('a')
        link.download = intl.get('M26P1022610110522000E001').d('异常信息.xlsx')
        link.href = window.URL.createObjectURL(blob)
        link.click()
    }

    // 查询
    public queryMessage = async (): Promise<void> => {
        const params = {
            begin: moment(this.state.rangeTime[0]).format('YYYYMMDDHHmmss'),
            end: moment(this.state.rangeTime[1]).format('YYYYMMDDHHmmss'),
            degree: this.state.degree,
            host: this.state.serverID,
            type: this.state.type,
            source: this.state.source,
            page_size: this.state.pageSize,
            page_index: 1,
            lang_id: this.props.lang,
            module: 26
        }
        const res: any = await _queryMessage(params)
        if (res && res.result) {
            if (!res.data) {
                message.warning(intl.get('M26P102261011051100PM001').d('暂无数据'))
                this.setState({ visible: false })
            } else {
                const data = JSON.parse(res.data)
                data.forEach((item: any): void => {
                    item.key = Math.random().toString()
                })
                this.setState({
                    visible: false,
                    queryKey: res.msg,
                    total: res.code,
                    pageIndex: 1,
                    dataSource: data
                })
                console.log(data)
            }
        }
    }

    // 页码改变
    public pageChange = (page: number): void => {
        this.setState({
            pageIndex: page
        }, (): void => { this.queryMessage2() })
    }

    // 分页每页条数改变
    public onShowSizeChange = (current: number, pageSize: number): void => {
        console.log(current, pageSize)
        this.setState({
            pageIndex: current,
            pageSize
        }, (): void => { this.queryMessage2() })
    }

    // 分页查询
    public queryMessage2 = async (): Promise<void> => {
        const res: any = await _queryMessage2({
            params: {
                query_id: this.state.queryKey,
                page_size: this.state.pageSize,
                page_index: this.state.pageIndex
            }
        })
        if (res && res.result) {
            const data = JSON.parse(res.data)
            data.forEach((item: any): void => {
                item.key = Math.random().toString()
            })
            this.setState({
                dataSource: data
            })
        }
    }

    public render(): React.ReactElement {
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            selectedRows: this.state.selectedRows,
            onChange: (selectedRowKeys: string[] | number[], selectedRows: any): void => {
                if (selectedRowKeys.length === 0) {
                    this.getRightOperation('')
                    this.setState({
                        selectedRowKeys, selectedRows
                    })
                } else {
                    this.getRightOperation('264')
                    const key = selectedRowKeys.pop().toString()
                    console.log(key)
                    this.setState({
                        selectedRowKeys: [key],
                        selectedRows: selectedRows.pop()
                    })
                }
            }
        }

        return (
            <div className={styles.main}>
                <div id="abnormalInfo" className={styles.wrapper}>
                    <Table
                        className={styles.tableWrapper}
                        scroll={{ x: true, y: this.state.tableHeight }}
                        columns={this.state.columns}
                        dataSource={this.state.dataSource}
                        rowSelection={rowSelection}
                        pagination={false}
                    />
                    <Pagination
                        total={this.state.total}
                        showSizeChanger={this.state.total > 0}
                        pageSize={this.state.pageSize}
                        current={this.state.pageIndex}
                        pageSizeOptions={['50', '100', '200', '500']}
                        onShowSizeChange={this.onShowSizeChange}
                        onChange={this.pageChange}
                    />
                    <Drawer
                        getContainer={false}
                        style={{ position: 'absolute' }}
                        height="auto"
                        title={intl.get('M26P1022610110305000M001').d('异常详情')}
                        placement="bottom"
                        closable={false}
                        visible={this.state.drawerVisible}
                        onClose={(): void => this.setState({ drawerVisible: false })}
                    >
                        <span>{this.state.selectedRows.Content}</span>
                    </Drawer>
                </div>
                <RightOperation rightOperationData={this.state.rightOperationData} operateCallBack={(data): void => this.rightIdData(data)} />

                {/* 查询弹窗 */}
                <DraggableModal
                    title={intl.get('M26P102261011010000MT001').d('查询条件')}
                    width={620}
                    visible={this.state.visible}
                    onCancel={(): void => this.setState({ visible: false })}
                    onOk={(): void => { this.queryMessage() }}
                >
                    <Row>
                        <Col span={6}>{intl.get('M26P1022610110522000L001').d('时间段')}</Col>
                        <Col span={18}>
                            <DatePicker.RangePicker
                                style={{ width: '100%' }}
                                ranges={{
                                    [intl.get('M26P10226101105120ML001').d('近一天')]: [moment().subtract(1, 'days'), moment()],
                                    [intl.get('M26P10226101105120ML002').d('近一周')]: [moment().subtract(7, 'days'), moment()],
                                    [intl.get('M26P10226101105120ML003').d('近一月')]: [moment().subtract(1, 'months'), moment()]
                                }}
                                disabledDate={(current: Moment): boolean => current > moment().endOf('day')}
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                value={this.state.rangeTime}
                                onChange={(dates: RangePickerValue): void => this.setState({ rangeTime: dates })}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>{intl.get('BDN000211107999').d('消息等级')}</Col>
                        <Col span={18}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                value={this.state.degree}
                                onChange={this.handleDegreeSelectChange.bind(this, 'degree')}
                            >
                                <Select.Option key={-1} value="-1">{intl.get('M26COM000000001').d('全部')}</Select.Option>
                                {
                                    this.state.degreeList.map((item: any): React.ReactElement => (
                                        <Select.Option key={item.valid_data}>{item.display_character}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>{intl.get('M26P1022610110303000M001').d('选择设备')}</Col>
                        <Col span={18}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                value={this.state.serverID}
                                onChange={this.handleSelectChange.bind(this, 'serverID')}
                            >
                                <Select.Option key={0} value="0">{intl.get('M26COM000000001').d('全部')}</Select.Option>
                                {
                                    this.state.serverList.map((item: any): React.ReactElement => (
                                        <Select.Option key={item.system_id} value={item.system_id}>{item.server_ip}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row className={styles.row}>
                        <Col span={6}>{intl.get('BDN000211120999').d('消息类别')}</Col>
                        <Col span={18}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                value={this.state.type}
                                onChange={this.handleSelectChange.bind(this, 'type')}
                            >
                                <Select.Option key={0} value="0">{intl.get('M26COM000000001').d('全部')}</Select.Option>
                                {
                                    this.state.typeList.map((item: any): React.ReactElement => (
                                        <Select.Option key={item.valid_data}>{item.display_character}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row className={styles.row}>
                        <Col span={6}>{intl.get('BDN000211121999').d('消息来源')}</Col>
                        <Col span={18}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                value={this.state.source}
                                onChange={this.handleSelectChange.bind(this, 'source')}
                            >
                                <Select.Option key={0} value="0">{intl.get('M26COM000000001').d('全部')}</Select.Option>
                                {
                                    this.state.sourceList.map((item: any): React.ReactElement => (
                                        <Select.Option key={item.valid_data}>{item.display_character}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Col>
                    </Row>
                </DraggableModal>

                <DraggableModal
                    title={intl.get('M26P1022610110522000M003').d('请选择')}
                    width={400}
                    visible={this.state.exportVisible}
                    onCancel={(): void => this.setState({ exportVisible: false })}
                    onOk={(): void => { this.export() }}
                >
                    <Radio.Group onChange={(e): void => { this.setState({ exportType: e.target.value }) }} value={this.state.exportType}>
                        <Radio value={1}>{intl.get('M26P102261011010000ML012').d('当前页')}</Radio>
                        <Radio value={2}>{intl.get('M26P102261011010000ML013').d('全部页')}</Radio>
                    </Radio.Group>
                </DraggableModal>
            </div>
        )
    }
}

const mapStateToProps = (state: any): IMapStateToProps => ({
    lang: state.langReducer.lang
})

export default connect(mapStateToProps, null)(AbnormalInfo)