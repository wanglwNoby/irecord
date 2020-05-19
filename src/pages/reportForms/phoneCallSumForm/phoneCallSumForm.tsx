import * as React from 'react'
import { Table, message, Row, Col, Radio, DatePicker, TreeSelect, Input } from 'antd'
import intl from 'react-intl-universal'
import moment from 'moment'
import echarts from 'echarts'
import { RangePickerValue } from 'antd/lib/date-picker/interface'
import { _getrightOperation, _extensionTree, _getColumns, _getDailyCallForm, _exportExtensionCall } from '../../../common/api/reportForms'
import DraggableModal from '../../../components/cores/draggableModal/draggableModal'
import RightOperation from '../../../components/containers/right-operation/rightOperation'
import { formatColumns } from '../../../utils/tableUtil'
import { formatTreeData } from '../../../utils/treeUtil'
import styles from './phoneCallSum.module.less'

interface IState {
    showStatisticsModal: boolean; // 控制统计条件的弹框
    rightOperationData: any[]; // 右边操作菜单
    department: string[]; // 获取分机
    extension: number; // 选择分机查询方式
    workerNumberData: any[];
    rangeTime: RangePickerValue; // 查询时间
    min_time: string; // 最小时长
    max_time: string; // 最大时长
    mediaColumns: any[];
    dataSource: any[];
    query_id: string;
    TreeShowSearch: boolean;
    tableHeight: number;
}

class PhoneCallSumForm extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            showStatisticsModal: false, // 控制统计条件的弹框
            rightOperationData: [], // 右边操作菜单
            department: [], // 获取分机
            extension: 1, // 选择分机查询方式
            workerNumberData: [],
            rangeTime: [moment().startOf('day'), moment().endOf('day')], // 查询时间
            min_time: '0', // 最小时长
            max_time: '', // 最大时长
            mediaColumns: [],
            dataSource: [],
            query_id: '',
            TreeShowSearch: true, // 支持多选
            tableHeight: 0

        }
    }

    public componentDidMount(): void {
        const monitor = document.querySelectorAll('#phoneCallTable')[0]
        this.setState({
            tableHeight: monitor.getBoundingClientRect().height - 450
        })
        this.getRightOperation()
        this.getColumns()
        this.getExtension()
    }

    public chartCall = (): void => {
        if (echarts.getInstanceByDom(document.getElementById('phonCallSumForm') as HTMLDivElement | HTMLCanvasElement)) {
            echarts.getInstanceByDom(document.getElementById('phonCallSumForm') as HTMLDivElement | HTMLCanvasElement).dispose()
        }
        const myChart = echarts.init(document.getElementById('phonCallSumForm') as HTMLDivElement | HTMLCanvasElement)
        const yTotal = []
        const data = this.state.dataSource
        yTotal.push(data[data.length - 1].totalcount) // 总话务量
        yTotal.push(data[data.length - 1].callin) // 呼入务量
        yTotal.push(data[data.length - 1].callout) // 呼出务量
        yTotal.push(data[data.length - 1].totallen) // 总时长
        yTotal.push(data[data.length - 1].callinlen) // 呼入时长
        yTotal.push(data[data.length - 1].calloutlen) // 呼出时长
        yTotal.push(data[data.length - 1].avgcalllen) // 平均时长
        // 绘制图表
        myChart.setOption({
            backgroundColor: '#43515f',
            title: {
                text: `${intl.get('FO1022610110502000000').d('分机录音统计')}`,
                left: '50%',
                top: '1%',
                textAlign: 'center',
                textStyle: {
                    color: '#e7e7e7'
                }
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: [`${intl.get('VP9122636110200000004').d('总话量')}`, `${intl.get('VP9122636110200000002').d('呼入话量')}`, `${intl.get('VP9122636110200000003').d('呼出话量')}`, `${intl.get('VP9122636110200000008').d('总时长')}`, `${intl.get('VP9122636110200000006').d('呼入时长')}`, `${intl.get('VP9122636110200000007').d('呼出时长')}`, `${intl.get('VP9122636110200000009').d('平均时长')}`],
                axisTick: {
                    show: true, // 是否显示网状线 默认为true
                    alignWithLabel: true
                },
                axisLabel: {
                    show: true,
                    color: '#e2e2e3' // 更改坐标轴文字颜色
                }
            },
            yAxis: {
                axisLabel: {
                    show: true,
                    color: '#e2e2e3', // 更改坐标轴文字颜色
                    fontSize: 14 // 更改坐标轴文字大小
                }
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        title: {
                            zoom: `${intl.get('M26P102261011050100PE002').d('区域缩放')}`,
                            back: `${intl.get('M26P102261011050100PE004').d('区域缩放还原')}`
                        }
                    },
                    magicType: {
                        type: ['line', 'bar'],
                        title: {
                            line: `${intl.get('M26P102261011050100PE003').d('切换为折线图')}`,
                            bar: `${intl.get('M26P102261011050100PE005').d('切换为柱状图')}`
                        }
                    },
                    restore: { title: `${intl.get('M26P102261011050100PE006').d('还原')}` }, // 设置工具栏的名称
                    saveAsImage: { title: `${intl.get('M26P102261011050100PE007').d('保存为图片')}` } // 设置工具栏的名称
                },
                iconStyle: {
                    borderColor: '#e2e2e3' // 设置工具栏边框颜色
                }
            },
            series: [{
                name: `${intl.get('M26P102261011050200P001').d('总计')}`,
                type: 'bar',
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#14c8d4' },
                                { offset: 1, color: '#43eec6' }
                            ]
                        )
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#14c8d4'
                    }
                },
                data: yTotal
            }]
        })
    }

    // 获取右侧菜单
    public getRightOperation = async (): Promise<void> => {
        const res: any = await _getrightOperation({
            params: {
                parent_id: '1022610110502000000',
                resource_id: ''
            }
        })
        if (res && res.result) {
            const rightOperation = res.data[0].P004
            this.setState({
                rightOperationData: rightOperation
            })
        }
    }

    // 获取表格的表头
    public getColumns = async (): Promise<void> => {
        const res: any = await _getColumns({
            params: {
                view_id: '9112636110300000000',
                type: '0'
            }
        })
        if (res && res.result) {
            const mediaColumns = formatColumns(res.data)
            this.setState({ mediaColumns })
        }
    }

    // 获取用户坐席工号数据树菜单
    public getExtension = async (): Promise<void> => {
        const res: any = await _extensionTree()
        if (res && res.result && res.data.length > 0) {
            this.setState({ workerNumberData: formatTreeData(res.data) })
        }
    }

    public rightIdData = (data: any): void => {
        if (data.P003 === 'OP102110000009999') {
            this.getExtension()
            this.setState({
                showStatisticsModal: true
            })
        } else if (data.P003 === 'OP102110000009998') {
            if (this.state.dataSource.length === 0) {
                message.warning(`${intl.get('COM00100010007').d('操作失败')}`)
                return
            }
            this.chartExport()
            console.log('导出')
        }
    }

    // 判断时长大于0的正整数
    public onblurDuration = (Duration: string, value: any): void => {
        if (value !== '') {
            if (Duration === 'min_time') {
                if (!/^[0-9]\d*$/.test(value)) {
                    this.setState({
                        min_time: '0'
                    })
                    message.error(`${intl.get('M26P102261011010000PM010').d('请输入大于0的正整数')}`)
                }
            } else if (Duration === 'max_time') {
                if (!/^[0-9]\d*$/.test(value)) {
                    this.setState({
                        max_time: '0'
                    })
                    message.error(`${intl.get('M26P102261011010000PM010').d('请输入大于0的正整数')}`)
                }
            }
        }
    }

    // 导出接口
    public chartExport = async (): Promise<void> => {
        const myChart = echarts.init(document.getElementById('phonCallSumForm') as HTMLDivElement | HTMLCanvasElement)
        const picInfo = myChart.getDataURL({})
        const res: any = await _exportExtensionCall({
            query_id: this.state.query_id,
            picture: picInfo
        })
        if (res !== '') {
            if (window.navigator.msSaveOrOpenBlob) {
                // 兼容ie11
                try {
                    const blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
                    window.navigator.msSaveOrOpenBlob(blob, `${intl.get('M26P102261011050200P002').d('分机录音统计报表.xlsx')}`)
                } catch (e) {
                    console.log(e)
                }
            } else {
                console.log(res)
                // 这里res.data是返回的blob对象
                const blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
                const link = document.createElement('a')
                link.download = `${intl.get('M26P102261011050200P002').d('分机录音统计报表.xlsx')}`
                link.href = window.URL.createObjectURL(blob)
                link.click()
            }
        }
    }

    // 这里是统计条件的接口
    public handleStatisticsQuery = async (): Promise<void> => {
        const res: any = await _getDailyCallForm({
            report_number: 2,
            begin: moment(this.state.rangeTime[0]).utc().format('YYYYMMDDHHmmss'),
            end: moment(this.state.rangeTime[1]).utc().format('YYYYMMDDHHmmss'),
            min_time: Number(this.state.min_time) < 0 ? 0 : Number(this.state.min_time),
            max_time: Number(this.state.max_time) < 0 ? 0 : Number(this.state.max_time) === 0 ? 9999 : Number(this.state.max_time),
            query_type: this.state.extension,
            extension: this.state.extension === 1 ? null : this.state.department
        })
        if (res.result && res.data !== '' && res.data !== '[]' && res.data !== 'null' && res.data !== null) {
            const data = JSON.parse(res.data)
            const queryId = res.msg
            data.forEach((item: any): void => {
                /* item.key = item.Extension */
                item.key = Math.random()
                /* if (item.Extension === null) {
                    item.Extension = ''
                } */
            })
            this.setState({
                dataSource: data,
                query_id: queryId,
                showStatisticsModal: false
            }, (): void => this.chartCall())
        } else {
            this.setState({
                dataSource: [],
                showStatisticsModal: false
            })
            message.warning(`${intl.get('M26P102261011051100PM001').d('暂无数据')}`)
        }
    }

    public render(): React.ReactElement {
        return (
            <div className={styles.main}>
                <div id="phoneCallTable" className={styles.contentLeft}>
                    {
                        this.state.dataSource.length > 0 &&
                        <React.Fragment>
                            <div id="phonCallSumForm" className={styles.chartWrapper} />
                            <Table
                                className={styles.table}
                                scroll={{ x: true, y: this.state.tableHeight }}
                                columns={this.state.mediaColumns}
                                dataSource={this.state.dataSource}
                                pagination={false}
                            />
                        </React.Fragment>
                    }
                </div>
                <RightOperation rightOperationData={this.state.rightOperationData} operateCallBack={(data): void => this.rightIdData(data)} />
                <DraggableModal
                    title={intl.get('M26P102261011010000MT001').d('查询条件')}
                    visible={this.state.showStatisticsModal}
                    onCancel={(): void => { this.setState({ showStatisticsModal: false }) }}
                    width={700}
                    onOk={(): void => { this.handleStatisticsQuery() }}
                >
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
                        <Col span={6}>{intl.get('VP9122636110400000005').d('时长')}</Col>
                        <Col span={9} style={{ paddingRight: '10px', position: 'relative' }}>
                            <span style={{ position: 'absolute', top: '0', right: '-5px' }}>--</span>
                            <Input value={this.state.min_time} placeholder={intl.get('M26P102261011010000PM011').d('最小时长')} style={{ color: '#001529' }} addonAfter={intl.get('M26P102261011010000ML003').d('秒')} onBlur={(e: any): void => { this.onblurDuration('min_time', e.target.value) }} onChange={(e): void => { this.setState({ min_time: e.target.value }) }} />
                        </Col>
                        <Col span={9} style={{ paddingLeft: '10px' }}>
                            <Input value={this.state.max_time} placeholder={intl.get('M26P102261011010000PM012').d('最大时长')} style={{ color: '#001529' }} addonAfter={intl.get('M26P102261011010000ML003').d('秒')} onBlur={(e: any): void => { this.onblurDuration('max_time', e.target.value) }} onChange={(e): void => { this.setState({ max_time: e.target.value }) }} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col span={6}>{intl.get('M26P102261011050100ML001').d('分机查询方式')}</Col>
                        <Col span={18}>
                            <Radio.Group value={this.state.extension} onChange={(e): void => { this.setState({ extension: e.target.value }) }}>
                                <Radio value={1}>{intl.get('M26P102261011050200ML002').d('所拥有的分机')}</Radio>
                                <Radio value={2}>{intl.get('VP9122636110100000002').d('分机')}</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                    {this.state.extension === 2 ?
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={6}>{intl.get('VP9122636110100000002').d('分机')}</Col>
                            <Col span={18}>
                                <TreeSelect
                                    treeData={this.state.workerNumberData}
                                    value={this.state.department}
                                    maxTagCount={3}
                                    onChange={(value: string[]): void => { this.setState({ department: value }) }}
                                    treeCheckable="true"
                                    showSearch={this.state.TreeShowSearch}
                                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                                    searchPlaceholder={intl.get('FO1022610110301010000').d('选择分机')}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                        </Row> : ''
                    }
                </DraggableModal>
            </div>
        )
    }
}

export default PhoneCallSumForm