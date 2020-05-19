import * as React from 'react'
import { Table, Row, Col, DatePicker, message, TreeSelect, Radio, Pagination, Checkbox, Tabs } from 'antd'
import intl from 'react-intl-universal'
import moment from 'moment'
import { RangePickerValue } from 'antd/lib/date-picker/interface'
import { _getrightOperation, _queryOrgUserTree, _getOperationLog, _getColumns, _getOperationLog2, _exportDownload, _newRoleFo } from '../../../common/api/reportForms'
import DraggableModal from '../../../components/cores/draggableModal/draggableModal'
import RightOperation from '../../../components/containers/right-operation/rightOperation'
import { formatColumns } from '../../../utils/tableUtil'
import { formatTreeData, operationData } from '../../../utils/treeUtil'
import styles from './operationLog.module.less'

function callback(key): void {
    console.log(key)
}

interface IState {
    rightOperationData: any[];
    mediaColumns: any[]; // 表头数据
    dataSource: any[]; // 表中数据
    showStatisticsModal: boolean; // 控制时间弹窗
    rangeTime: RangePickerValue;
    workerNumberData: any[]; // 获取用户列表
    department: string[];
    total: number;
    pageSize: number;
    query_id: string;
    pageIndex: number;
    showExportModal: boolean;
    exportValue: number;
    tableHeight: number;
    TreeShowSearch: boolean;
    operationResult: any[];
    operationEventData: any[];
    operationEvent: any[];
}

class OperationLog extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            rightOperationData: [], // 右边操作菜单
            mediaColumns: [], // 表头数据
            dataSource: [], // 表中数据
            showStatisticsModal: false, // 控制时间弹窗
            rangeTime: [moment().startOf('day'), moment().endOf('day')],
            workerNumberData: [], // 获取用户列表
            operationEventData: [], // 获取操作事件
            department: [], // 存用户列表
            total: 0, // 总条数
            query_id: '', // 流水号
            pageSize: 50, // 每页总共显示条数
            pageIndex: 1, // 当前页数
            showExportModal: false,
            exportValue: 1,
            tableHeight: 0,
            TreeShowSearch: true, // 是否支持多选
            operationResult: ['0', '2', '5'], // 操作结果
            operationEvent: [] // 存操作事件
        }
    }

    public componentDidMount(): void {
        const abnormal = document.querySelectorAll('#operationLog')[0]
        this.setState({
            tableHeight: abnormal.getBoundingClientRect().height - 102
        })
        this.getRightOperation()
        this.getColumns()
        this.getUser()
        this.getirecordModular()
    }

    // 获取表格的表头
    public getColumns = async (): Promise<void> => {
        const res: any = await _getColumns({
            params: {
                view_id: '9111110111100100000',
                type: '0'
            }
        })
        if (res && res.result) {
            console.log(res)
            const mediaColumns = formatColumns(res.data)
            this.setState({ mediaColumns })
        }
    }

    // 获取右侧菜单
    public getRightOperation = async (): Promise<void> => {
        const res: any = await _getrightOperation({
            params: {
                parent_id: '1022610110521000000',
                resource_id: ''
            }
        })
        if (res && res.result) {
            console.log(res)
            const rightOperation = res.data[0].P004
            console.log(rightOperation)
            this.setState({
                rightOperationData: rightOperation
            })
        }
    }

    // 获取用户下面的信息
    /* public TreeonSelect = (treeNode): any => (
        new Promise((resolve): any => {
            _queryOrg({
                params: { parent_org_id: treeNode.props.value }
            }).then((res: any): void => {
                if (res && res.result && res.data !== 'null') {
                    const workerNumberData = JSON.parse(JSON.stringify(this.state.workerNumberData))
                    console.log(workerNumberData)
                    const localMachine = res.data
                    const treedata = []
                    localMachine.forEach((item: any): void => {
                        treedata.push({ title: item.name, key: item.system_id, value: item.system_id })
                    })
                    treeNode.props.dataRef.children = treedata
                    this.setState((prevState: any): any => ({
                        workerNumberData: [...prevState.workerNumberData]
                    }))
                }
                resolve()
            })
        })
    ) */

    // 获取顶级机构
    public getUser = async (): Promise<void> => {
        const res: any = await _queryOrgUserTree()
        if (res && res.result) {
            this.setState({ workerNumberData: formatTreeData(res.data) })
        }
    }

    // 获取操作事件
    public getirecordModular = async (): Promise<void> => {
        const res: any = await _newRoleFo({
            params: {
                module_id: '26'
            }
        })
        if (res && res.result) {
            this.setState({ operationEventData: operationData(res.data) })
        }
    }

    // 处理操作事件树
    /* public manageoperationEvent = (data: void): void => {

    } */

    // 查询播放记录的数据
    public handleStatisticsQuery = async (): Promise<void> => {
        console.log(this.state.operationResult.toString(), this.state.department.toString(), this.state.operationEvent.toString())
        const res: any = await _getOperationLog({
            begin: moment(this.state.rangeTime[0]).format('YYYYMMDDHHmmss'),
            end: moment(this.state.rangeTime[1]).format('YYYYMMDDHHmmss'),
            userId: this.state.department.toString(),
            result: this.state.operationResult.toString(),
            operationId: this.state.operationEvent.toString(),
            page_size: this.state.pageSize
        })
        console.log(JSON.parse(res.data))
        if (res.result && res.data !== '' && res.data !== '[]' && res.data !== 'null' && res.data !== null) {
            const data = JSON.parse(res.data)
            data.forEach((item: any): void => {
                item.key = Math.random()
            })
            this.setState({
                dataSource: data,
                total: res.code,
                query_id: res.msg
            })
        } else {
            this.setState({
                dataSource: []
            })
            message.warning(`${intl.get('M26P102261011051100PM001').d('暂无数据')}`)
        }
        this.setState({
            showStatisticsModal: false
        })
    }

    // 分页改变
    public pageChange = (page: number): void => {
        this.setState({
            pageIndex: page
        }, (): Promise<void> => this.handleStatisticsQuery2())
    }

    // 分页每页条数改变
    public onShowSizeChange = (current: number, pageSize: number): void => {
        console.log(current, pageSize)
        this.setState({
            pageIndex: current,
            pageSize
        }, (): Promise<void> => this.handleStatisticsQuery2())
    }

    // 分页查询
    public handleStatisticsQuery2 = async (): Promise<void> => {
        const datas = {
            query_id: this.state.query_id,
            page_index: this.state.pageIndex,
            page_size: this.state.pageSize
        }
        console.log(datas)
        const res: any = await _getOperationLog2({
            params: {
                query_id: this.state.query_id,
                page_index: this.state.pageIndex,
                page_size: this.state.pageSize
            }
        })
        console.log(res)
        if (res.result && res.data !== '') {
            const data = JSON.parse(res.data)
            data.forEach((item: any): void => {
                item.key = Math.random()
            })
            this.setState({
                dataSource: data
            })
        }
    }

    // 导出接口
    public chartExport = async (): Promise<void> => {
        if (this.state.dataSource.length !== 0) {
            if (this.state.exportValue === 1) {
                const res: any = await _exportDownload({
                    query_id: this.state.query_id,
                    page_index: this.state.pageIndex,
                    page_size: this.state.pageSize
                })
                console.log(res)
                if (res !== '') {
                    this.setState({
                        showExportModal: false
                    })
                    console.log(res)
                    // 这里res.data是返回的blob对象
                    const blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
                    const link = document.createElement('a')
                    link.download = `${intl.get('M26P0226101105120P001').d('下载记录报表.xlsx')}`
                    link.href = window.URL.createObjectURL(blob)
                    link.click()
                    return
                }
            } else if (this.state.exportValue === 2) {
                const res: any = await _exportDownload({
                    query_id: this.state.query_id,
                    page_index: 1,
                    page_size: this.state.total
                })
                if (res !== '') {
                    this.setState({
                        showExportModal: false
                    })
                    console.log(res)
                    // 这里res.data是返回的blob对象
                    const blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
                    const link = document.createElement('a')
                    link.download = `${intl.get('M26P0226101105120P001').d('下载记录报表.xlsx')}`
                    link.href = window.URL.createObjectURL(blob)
                    link.click()
                    return
                }
            }
        }
        message.error(`${intl.get('M26P102261011051100PM002').d('数据为空,导出失败')}`)
    }

    public rightIdData = (data: any): void => {
        console.log(data)
        if (data.P003 === 'OP102261011052101') {
            /*   this.getExtension() */
            this.setState({
                showStatisticsModal: true
            })
        } else if (data.P003 === 'OP102261011052109') {
            this.setState({
                showExportModal: true
            })
        }
    }

    public render(): React.ReactElement {
        return (
            <div className={styles.main}>
                <div id="operationLog" className={styles.wrapper}>
                    <Table
                        className={styles.table}
                        scroll={{ x: true, y: this.state.tableHeight }}
                        columns={this.state.mediaColumns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                    />
                    <Pagination
                        total={this.state.total}
                        /* showQuickJumper={this.state.total > 0} */
                        showSizeChanger={this.state.total > 0}
                        hideOnSinglePage={this.state.total === 0}
                        pageSize={this.state.pageSize}
                        pageSizeOptions={['50', '100', '200', '500']}
                        onShowSizeChange={this.onShowSizeChange}
                        onChange={this.pageChange}
                    />
                </div>
                <RightOperation rightOperationData={this.state.rightOperationData} operateCallBack={(data): void => this.rightIdData(data)} />
                <DraggableModal
                    title={intl.get('M26P102261011010000MT001').d('查询条件')}
                    visible={this.state.showStatisticsModal}
                    onCancel={(): void => { this.setState({ showStatisticsModal: false }) }}
                    width={700}
                    onOk={(): void => { this.handleStatisticsQuery() }}
                >
                    <Tabs defaultActiveKey="1" onChange={callback}>
                        <Tabs.TabPane tab={intl.get('M26P102261011090100MC001').d('基本配置')} key="1">
                            <Row style={{ marginTop: '20px' }}>
                                <Col span={6}>{intl.get('M26P1022610110522000L001').d('时间段')}</Col>
                                <Col span={18}>
                                    <DatePicker.RangePicker
                                        ranges={{
                                            [intl.get('M26P10226101105120ML001').d('近一天')]: [moment().subtract(1, 'days'), moment()],
                                            [intl.get('M26P10226101105120ML002').d('近一周')]: [moment().subtract(7, 'days'), moment()],
                                            [intl.get('M26P10226101105120ML003').d('近一月')]: [moment().subtract(1, 'months'), moment()]
                                        }}
                                        showTime
                                        style={{ width: '100%' }}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        value={this.state.rangeTime}
                                        onChange={(dates): void => { this.setState({ rangeTime: dates }) }}
                                    />
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '20px' }}>
                                <Col span={6}>{intl.get('VP9121110111100100006').d('操作结果')}</Col>
                                <Col span={18}>
                                    <Checkbox.Group value={this.state.operationResult} onChange={(e): void => this.setState({ operationResult: e })}>
                                        <Checkbox value="0">{intl.get('BDN000211108000').d('未知')}</Checkbox>
                                        <Checkbox value="2">{intl.get('BDN000211108002').d('成功')}</Checkbox>
                                        <Checkbox value="5">{intl.get('BDN000211108005').d('失败')}</Checkbox>
                                    </Checkbox.Group>
                                </Col>
                            </Row>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={intl.get('M26P102261011051100ML001').d('用户')} key="2">
                            <Row style={{ marginTop: '20px' }}>
                                <Col span={6}>{intl.get('M26P102261011051100ML001').d('用户')}</Col>
                                <Col span={18}>
                                    <TreeSelect
                                        treeData={this.state.workerNumberData}
                                        value={this.state.department}
                                        maxTagCount={3}
                                        onChange={(value: string[]): void => { this.setState({ department: value }, (): void => { console.log(this.state.department.toString()) }) }}
                                        treeCheckable="true"
                                        showSearch={this.state.TreeShowSearch}
                                        showCheckedStrategy={TreeSelect.SHOW_CHILD}
                                        searchPlaceholder={intl.get('M26P102261011051100ML002').d('请选择用户')}
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                            </Row>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={intl.get('VP9121110111100100003').d('操作事件')} key="3">
                            <Row style={{ marginTop: '20px' }}>
                                <Col span={6}>{intl.get('VP9121110111100100003').d('操作事件')}</Col>
                                <Col span={18}>
                                    <TreeSelect
                                        treeData={this.state.operationEventData}
                                        value={this.state.operationEvent}
                                        maxTagCount={3}
                                        onChange={(value: string[]): void => { this.setState({ operationEvent: value }) }}
                                        treeCheckable="true"
                                        showSearch={this.state.TreeShowSearch}
                                        showCheckedStrategy={TreeSelect.SHOW_CHILD}
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                            </Row>
                        </Tabs.TabPane>
                    </Tabs>
                </DraggableModal>
                <DraggableModal
                    title={intl.get('FO1022610110103000000').d('导出-数据')}
                    visible={this.state.showExportModal}
                    onCancel={(): void => { this.setState({ showExportModal: false }) }}
                    width={400}
                    onOk={(): void => { this.chartExport() }}
                >
                    <Radio.Group onChange={(e): void => { this.setState({ exportValue: e.target.value }) }} value={this.state.exportValue}>
                        <Radio value={1}>{intl.get('M26P102261011010000ML012').d('当前页')}</Radio>
                        <Radio value={2}>{intl.get('M26P102261011010000ML013').d('全部页')}</Radio>
                    </Radio.Group>
                </DraggableModal>
            </div>
        )
    }
}


export default OperationLog