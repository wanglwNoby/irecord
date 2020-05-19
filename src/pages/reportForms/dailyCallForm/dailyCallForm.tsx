import * as React from 'react'
import { Table, Row, Col, DatePicker, TreeSelect, Radio, message, Select } from 'antd'
import intl from 'react-intl-universal'
import moment from 'moment'
import echarts from 'echarts'
import { RangePickerValue } from 'antd/lib/date-picker/interface'
import { _getrightOperation, _getColumns, _getDailyCallForm, _extensionTree, _exportDaily } from '../../../common/api/reportForms'
import DraggableModal from '../../../components/cores/draggableModal/draggableModal'
import RightOperation from '../../../components/containers/right-operation/rightOperation'
import { formatColumns } from '../../../utils/tableUtil'
import { formatTreeData } from '../../../utils/treeUtil'
import styles from './dailyCallForm.module.less'

interface IState {
    showStatisticsModal: boolean; // 控制统计条件的弹框
    rangeTime: RangePickerValue; // 获取时间
    customTime: RangePickerValue; // 自定义查询时间
    department: string[]; // 获取分机
    extension: number; // 选择分机查询方式
    rightOperationData: any[]; // 右边操作菜单
    mediaColumns: any[]; // 获取的表头
    dataSource: any[];
    workerNumberData: any[];
    customType: string;
    type: string;
    isopen: boolean;
    query_id: string;
    tableHeight: number;
}

class DailyCallForms extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            showStatisticsModal: false, // 控制统计条件的弹框
            customTime: [moment().startOf('day'), moment().endOf('day')], // 自定义查询时间
            rangeTime: [moment().startOf('day')]/* [moment().startOf('day').utc().format('YYYYMMDDHHmmss'), moment().endOf('day').utc().format('YYYYMMDDHHmmss')] *//* [moment().format('YYYY-MM-DD')] */, // 获取时间
            department: [], // 获取分机
            extension: 1, // 选择分机查询方式
            rightOperationData: [], // 右边操作菜单
            mediaColumns: [], // 获取的表头
            dataSource: [],
            workerNumberData: [],
            customType: 'D',
            type: 'D',
            isopen: false, // 选择年的打开控件
            query_id: '',
            tableHeight: 0
        }
    }

    public componentDidMount(): void {
        const monitor = document.querySelectorAll('#dailuCallTable')[0]
        this.setState({
            tableHeight: monitor.getBoundingClientRect().height - 450
        })
        this.getRightOperation()
        this.getColumns()
        this.getExtension()
    }

    public chartCall = (): void => {
        // 基于准备好的dom，初始化echarts实例
        console.log(document.getElementById('chartID'))
        if (echarts.getInstanceByDom(document.getElementById('chartID') as HTMLDivElement | HTMLCanvasElement)) {
            echarts.getInstanceByDom(document.getElementById('chartID') as HTMLDivElement | HTMLCanvasElement).dispose()
        }
        const myChart = echarts.init(document.getElementById('chartID') as HTMLDivElement | HTMLCanvasElement)

        const StatDay = this.state.dataSource.map((item): any => (item.statday)) // X轴的数值
        const TotalCount = this.state.dataSource.map((item): any => (item.totalcount)) // 总话务量
        const CallIn = this.state.dataSource.map((item): any => (item.callin)) // 呼入务量
        const CallOut = this.state.dataSource.map((item): any => (item.callout)) // 呼出务量
        const TotalLen = this.state.dataSource.map((item): any => (item.totallen)) // 总时长
        const CallInLen = this.state.dataSource.map((item): any => (item.callinlen)) // 呼入时长
        const CallOutLen = this.state.dataSource.map((item): any => (item.calloutlen)) // 呼出时长
        const AvgCallLen = this.state.dataSource.map((item): any => (item.avgcalllen)) // 平均时长
        const CountPercent = this.state.dataSource.map((item): any => (item.countpercent)) // 百分比

        // 绘制图表
        myChart.setOption({
            backgroundColor: '#43515f',
            title: {
                text: `${intl.get('FO1022610110501000000').d('所有录音统计')}`,
                left: '50%',
                top: '1%',
                textAlign: 'center',
                textStyle: {
                    color: '#e7e7e7'
                }
            },
            grid: {
                height: 250
            },
            legend: {
                left: 'center',
                bottom: 40,
                itemGap: 10,
                textStyle: { // 图例文字的样式
                    color: '#e7e7e7',
                    fontSize: 12
                },
                selectedMode: 'single', // 单选
                selected: {
                    总话量: true,
                    呼入话量: false,
                    呼出话量: false,
                    总时长: false,
                    呼入时长: false,
                    呼出时长: false,
                    平均时长: false,
                    '呼叫量占比(%)': false
                },

                data: [
                    { name: `${intl.get('VP9122636110200000004').d('总话量')}`, icon: 'circle' },
                    { name: `${intl.get('VP9122636110200000002').d('呼入话量')}`, icon: 'circle' },
                    { name: `${intl.get('VP9122636110200000003').d('呼出话量')}`, icon: 'circle' },
                    { name: `${intl.get('VP9122636110200000008').d('总时长')}`, icon: 'circle' },
                    { name: `${intl.get('VP9122636110200000006').d('呼入时长')}`, icon: 'circle' },
                    { name: `${intl.get('VP9122636110200000007').d('呼出时长')}`, icon: 'circle' },
                    { name: `${intl.get('VP9122636110200000009').d('平均时长')}`, icon: 'circle' },
                    { name: `${intl.get('M26P102261011050100PE001').d('呼叫量占比(%)')}`, icon: 'circle' }]
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: StatDay,
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
            dataZoom: [
                {
                    type: 'inside',
                    show: true
                },
                { textStyle: { color: '#dee1e3', lineHeight: 10 } }
            ],
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
                name: `${intl.get('VP9122636110200000004').d('总话量')}`,
                type: 'bar',
                data: TotalCount,
                barWidth: 20,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#fbc807'
                        }, {
                            offset: 1,
                            color: '#a78504'
                        }]),
                        barBorderRadius: 12
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#fbc807'
                    }
                }
            },
            {
                name: `${intl.get('VP9122636110200000002').d('呼入话量')}`,
                type: 'bar',
                data: CallIn,
                barWidth: 20,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#a4cdee'
                        }, {
                            offset: 1,
                            color: '#1c8fec'
                        }]),
                        barBorderRadius: 12
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#a4cdee'
                    }
                }
            },
            {
                name: `${intl.get('VP9122636110200000003').d('呼出话量')}`,
                type: 'bar',
                data: CallOut,
                barWidth: 20,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#248ff7'
                        }, {
                            offset: 1,
                            color: '#6851f1'
                        }]),
                        barBorderRadius: 12
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#248ff7'
                    }
                }
            },
            {
                name: `${intl.get('VP9122636110200000008').d('总时长')}`,
                type: 'bar',
                data: TotalLen,
                barWidth: 20,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#ff9080'
                        }, {
                            offset: 1,
                            color: '#96554c'
                        }]),
                        barBorderRadius: 12
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#ff9080'
                    }
                }
            },
            {
                name: `${intl.get('VP9122636110200000006').d('呼入时长')}`,
                type: 'bar',
                data: CallInLen,
                barWidth: 20,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#8bd46e'
                        }, {
                            offset: 1,
                            color: '#09bcb7'
                        }]),
                        barBorderRadius: 12
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#8bd46e'
                    }
                }
            },
            {
                name: `${intl.get('VP9122636110200000007').d('呼出时长')}`,
                type: 'bar',
                data: CallOutLen,
                barWidth: 20,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#fccb05'
                        }, {
                            offset: 1,
                            color: '#f5804d'
                        }]),
                        barBorderRadius: 12
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#fccb05'
                    }
                }
            },
            {
                name: `${intl.get('VP9122636110200000009').d('平均时长')}`,
                type: 'bar',
                data: AvgCallLen,
                barWidth: 20,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#03f9f9'
                        }, {
                            offset: 1,
                            color: '#07b3b3'
                        }]),
                        barBorderRadius: 12
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#03f9f9'
                    }
                }
            },
            {
                name: `${intl.get('M26P102261011050100PE001').d('呼叫量占比(%)')}`,
                type: 'bar',
                data: CountPercent,
                barWidth: 20,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#8b78f6'
                        }, {
                            offset: 1,
                            color: '#483e84'
                        }]),
                        barBorderRadius: 12
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#8b78f6'
                    }
                }
            }]
        })
        myChart.on('legendselectchanged', (): void => {
            const options = myChart.getOption()
            myChart.setOption(options, true)
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
                view_id: '9112636110200000000',
                type: '0'
            }
        })
        if (res && res.result) {
            const mediaColumns = formatColumns(res.data)
            this.setState({ mediaColumns })
        }
    }


    public rightIdData = (data: any): void => {
        if (data.P003 === 'OP102110000009999') {
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

    // 导出接口
    public chartExport = async (): Promise<void> => {
        const myChart = echarts.init(document.getElementById('chartID') as HTMLDivElement | HTMLCanvasElement)
        const picInfo = myChart.getDataURL({ pixelRatio: 1 })
        const res: any = await _exportDaily({
            query_id: this.state.query_id,
            picture: picInfo
        })
        if (res !== '') {
            if (window.navigator.msSaveOrOpenBlob) {
                // 兼容ie11
                try {
                    const blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
                    window.navigator.msSaveOrOpenBlob(blob, `${intl.get('M26P102261011050500P001').d('所有录音统计报表.xlsx')}`)
                } catch (e) {
                    console.log(e)
                }
            } else {
                console.log(res)
                // 这里res.data是返回的blob对象
                const blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
                const link = document.createElement('a')
                link.download = `${intl.get('M26P102261011050500P001').d('所有录音统计报表.xlsx')}`
                link.href = window.URL.createObjectURL(blob)
                link.click()
            }
        }
    }

    // 这里是统计条件的接口
    public handleStatisticsQuery = async (): Promise<void> => {
        const time = this.state.rangeTime
        let beginTime
        let endTime
        let typeValue
        let customValue = ''
        if (this.state.type === 'D') {
            beginTime = moment(time[0]).startOf('day').utc().format('YYYYMMDDHHmmss')
            endTime = moment(time[0]).endOf('day').utc().format('YYYYMMDDHHmmss')
            typeValue = this.state.type
        } else if (this.state.type === 'W') {
            beginTime = moment(time[0]).day(0).utc().format('YYYYMMDDHHmmss')
            endTime = moment(moment(time[0], 'YYYYMMDDHHmmss').day(6).format('YYYYMMDD235959'), 'YYYYMMDD HH:mm:ss').utc().format('YYYYMMDDHHmmss')
            typeValue = this.state.type
        } else if (this.state.type === 'M') {
            beginTime = moment(time[0]).startOf('month').utc().format('YYYYMMDDHHmmss')
            endTime = moment(time[0]).endOf('month').utc().format('YYYYMMDDHHmmss')
            typeValue = this.state.type
        } else if (this.state.type === 'Y') {
            beginTime = moment(time[0]).startOf('year').utc().format('YYYYMMDDHHmmss')
            endTime = moment(time[0]).endOf('year').utc().format('YYYYMMDDHHmmss')
            typeValue = this.state.type
        } else if (this.state.type === 'C') {
            beginTime = moment(this.state.customTime[0]).utc().format('YYYYMMDDHHmmss')
            endTime = moment(this.state.customTime[1]).utc().format('YYYYMMDDHHmmss')
            typeValue = this.state.customType
            customValue = this.state.type
        }
        const res: any = await _getDailyCallForm({
            begin: beginTime,
            end: endTime,
            type: typeValue,
            custom: customValue,
            report_number: 1,
            query_type: this.state.extension,
            extension: this.state.extension === 1 ? [] : this.state.department
        })
        if (res.result && res.data !== '' && res.data !== '[]' && res.data !== 'null' && res.data !== null) {
            const data = JSON.parse(res.data)
            data.forEach((item: any): void => {
                item.key = item.statday.replace(/-/g, '').replace(/\s+/g, '')
            })
            this.setState({
                dataSource: data,
                query_id: res.msg,
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

    // 选择年控件
    public handleOpenChange = (status: boolean): void => {
        console.log(status)
        if (status) {
            this.setState({ isopen: true })
        } else {
            this.setState({ isopen: false })
        }
    }

    // 选择年的时间
    public handlePanelChange = (value): void => {
        this.setState({
            rangeTime: [value],
            isopen: false
        })
    }

    public radioonChange = (e): void => {
        this.setState({ type: e.target.value })
    }

    // 获取用户坐席工号数据树菜单
    public getExtension = async (): Promise<void> => {
        const res: any = await _extensionTree()
        if (res && res.result && res.data.length > 0) {
            this.setState({ workerNumberData: formatTreeData(res.data) })
        }
    }

    public render(): React.ReactElement {
        return (
            <div className={styles.main}>
                <div id="dailuCallTable" className={styles.contentLeft}>
                    {
                        this.state.dataSource.length > 0 &&
                        <React.Fragment>
                            <div id="chartID" className={styles.chartWrapper} />
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
                        <Col span={6}>{intl.get('M26P102261011050500ML001').d('查询周期')}</Col>
                        <Col span={18}>
                            <Radio.Group onChange={this.radioonChange} value={this.state.type}>
                                <Radio value="D">
                                    {intl.get('M26P102261011050500ML002').d('天')}
                                </Radio>
                                <Radio value="W">
                                    {intl.get('M26P102261011050500ML003').d('周')}
                                </Radio>
                                <Radio value="M">
                                    {intl.get('M26P102261011050500ML004').d('月')}
                                </Radio>
                                <Radio value="Y">
                                    {intl.get('M26P102261011050500ML005').d('年')}
                                </Radio>
                                <Radio value="C">
                                    {intl.get('M26P102261011050500ML006').d('自定义')}
                                </Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col span={6}>{intl.get('M26P1022610110522000L001').d('时间段')}</Col>
                        <Col span={18}>
                            {this.state.type === 'D' ?
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD"
                                    value={moment(this.state.rangeTime[0])}
                                    onChange={(dates: any): void => { this.setState({ rangeTime: [dates] }) }}
                                /> :
                                this.state.type === 'W' ?
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        format="YYYY-MM-DD"
                                        value={moment(this.state.rangeTime[0])}
                                        onChange={(dates: any): void => { this.setState({ rangeTime: [dates] }) }}
                                    /> :
                                    this.state.type === 'M' ?
                                        <DatePicker.MonthPicker
                                            style={{ width: '100%' }}
                                            format="YYYY-MM"
                                            value={moment(this.state.rangeTime[0])}
                                            onChange={(dates: any): void => { this.setState({ rangeTime: [dates] }) }}
                                        /> : this.state.type === 'Y' ?
                                            <DatePicker
                                                mode="year"
                                                style={{ width: '100%' }}
                                                open={this.state.isopen}
                                                value={moment(this.state.rangeTime[0])}
                                                format="YYYY"
                                                onOpenChange={this.handleOpenChange}
                                                onPanelChange={this.handlePanelChange}
                                                onChange={(): void => { this.setState({ rangeTime: [] }) }}
                                            /> : this.state.type === 'C' ?
                                                <DatePicker.RangePicker
                                                    ranges={{
                                                        [intl.get('M26P10226101105120ML001').d('近一天')]: [moment().subtract(1, 'days'), moment()],
                                                        [intl.get('M26P10226101105120ML002').d('近一周')]: [moment().subtract(7, 'days'), moment()],
                                                        [intl.get('M26P10226101105120ML003').d('近一月')]: [moment().subtract(1, 'months'), moment()]
                                                    }}
                                                    showTime
                                                    style={{ width: '100%' }}
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    value={this.state.customTime}
                                                    onChange={(dates): void => { this.setState({ customTime: dates }) }}
                                                /> : ''}
                        </Col>
                    </Row>
                    {this.state.type === 'C' ?
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={6}>{intl.get('M26P102261011050500ML007').d('自定义查询周期')}</Col>
                            <Col span={18}>
                                <Select value={this.state.customType} style={{ width: '100%' }} onChange={(e): void => this.setState({ customType: e })}>
                                    <Select.Option value="D">{intl.get('M26P102261011050500ML002').d('天')}</Select.Option>
                                    <Select.Option value="W">{intl.get('M26P102261011050500ML003').d('周')}</Select.Option>
                                    <Select.Option value="M">{intl.get('M26P102261011050500ML004').d('月')}</Select.Option>
                                    <Select.Option value="Y">{intl.get('M26P102261011050500ML005').d('年')}</Select.Option>
                                </Select>
                            </Col>
                        </Row> : ''
                    }
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

export default DailyCallForms