import * as React from 'react'
import { Table, Row, Col, DatePicker, TreeSelect, Radio, message } from 'antd'
import intl from 'react-intl-universal'
import moment from 'moment'
import echarts from 'echarts'
import { RangePickerValue } from 'antd/lib/date-picker/interface'
import { _getrightOperation, _getColumns, _queryDepart, _exportDaily, _getDailyCallForm } from '../../../common/api/reportForms'
import DraggableModal from '../../../components/cores/draggableModal/draggableModal'
import RightOperation from '../../../components/containers/right-operation/rightOperation'
import { formatColumns } from '../../../utils/tableUtil'
import { departmentTreeData } from '../../../utils/treeUtil'
import styles from './branchCallForm.module.less'

interface IState {
    showStatisticsModal: boolean; // 控制统计条件的弹框
    rangeTime: RangePickerValue; // 查询时间
    department: string[]; // 获取部门
    rightOperationData: any[]; // 右边操作菜单
    mediaColumns: any[]; // 获取的表头
    dataSource: any[];
    workerNumberData: any[];
    query_id: string;
    extension: number;
    departmentList: any[];
    tableHeight: number;
    datalist: any[];
    echartslist: any[];
    echarSelected: any;
}

class BranchCallForm extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            showStatisticsModal: false, // 控制统计条件的弹框
            rangeTime: [moment().startOf('day'), moment().endOf('day')], // 查询时间
            department: [], // 获取分机
            rightOperationData: [], // 右边操作菜单
            mediaColumns: [], // 获取的表头
            dataSource: [],
            workerNumberData: [],
            query_id: '',
            extension: 1, // 选择所有部门
            departmentList: [], // 获取部门的list
            tableHeight: 0,
            datalist: [],
            echartslist: [],
            echarSelected: {
                总话量: true,
                呼入话量: false,
                呼出话量: false,
                总时长: false,
                呼入时长: false,
                呼出时长: false,
                平均时长: false,
                '呼叫量占比(%)': false
            }
        }
    }

    public componentDidMount(): void {
        const monitor = document.querySelectorAll('#branchCallTable')[0]
        this.setState({
            tableHeight: monitor.getBoundingClientRect().height - 450
        })
        this.getRightOperation()
        this.getColumns()
        this.getExtension()
        this.getUser()
    }

    public chartCall = (): void => {
        // 基于准备好的dom，初始化echarts实例
        console.log(document.getElementById('branchCall'))
        if (echarts.getInstanceByDom(document.getElementById('branchCall') as HTMLDivElement | HTMLCanvasElement)) {
            echarts.getInstanceByDom(document.getElementById('branchCall') as HTMLDivElement | HTMLCanvasElement).dispose()
        }
        const myChart = echarts.init(document.getElementById('branchCall') as HTMLDivElement | HTMLCanvasElement)
        const StatDay = this.state.echartslist.map((item): any => (item.DepartMentName))
        const TotalCount = this.state.echartslist.map((item: any): any => ({
            id: item.DepartId, value: item.TotalCount
        })) // 总话量
        /*  const TotalCount = this.state.echartslist.map((item): any => (id: item.DepartId, item., item.TotalCount)) */
        const CallIn = this.state.echartslist.map((item: any): any => ({
            id: item.DepartId, value: item.CallIn
        })) // 呼入务量
        const CallOut = this.state.echartslist.map((item: any): any => ({
            id: item.DepartId, value: item.CallOut
        }))// 呼出务量
        const TotalLen = this.state.echartslist.map((item: any): any => ({
            id: item.DepartId, value: item.TotalLen
        })) // 总时长
        const CallInLen = this.state.echartslist.map((item: any): any => ({
            id: item.DepartId, value: item.CallInLen
        })) // 呼入时长
        const CallOutLen = this.state.echartslist.map((item: any): any => ({
            id: item.DepartId, value: item.CallOutLen
        })) // 呼出时长
        const AvgCallLen = this.state.echartslist.map((item: any): any => ({
            id: item.DepartId, value: item.AvgCallLen
        })) // 平均时长
        const selecteds = this.state.echarSelected // 获取图例状态
        const CountPercent = this.state.echartslist.map((item: any): any => ({
            id: item.DepartId, value: item.CountPercent
        })) // 百分比
        /* const StatDay = this.state.datalist.map((item): any => (item.StatDay)) // X轴的数值
        const TotalCount = this.state.datalist.map((item): any => (item.TotalCount)) // 总话务量
        const CallIn = this.state.datalist.map((item): any => (item.CallIn)) // 呼入务量
        const CallOut = this.state.datalist.map((item): any => (item.CallOut)) // 呼出务量
        const TotalLen = this.state.datalist.map((item): any => (item.TotalLen)) // 总时长
        const CallInLen = this.state.datalist.map((item): any => (item.CallInLen)) // 呼入时长
        const CallOutLen = this.state.datalist.map((item): any => (item.CallOutLen)) // 呼出时长
        const AvgCallLen = this.state.datalist.map((item): any => (item.AvgCallLen)) // 平均时长 */

        // 绘制图表
        myChart.setOption({
            backgroundColor: '#43515f',
            title: {
                text: `${intl.get('FO1022610110505000000').d('部门呼叫统计')}`,
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
                selected: selecteds,
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
                barWidth: 30,
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
                barWidth: 30,
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
                barWidth: 30,
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
                barWidth: 30,
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
                barWidth: 30,
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
                barWidth: 30,
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
                barWidth: 30,
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
                barWidth: 30,
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
        myChart.on('legendselectchanged', (params): void => {
            const options = myChart.getOption()
            console.log(params)
            const data = params.selected
            this.setState({
                echarSelected: data
            })
            myChart.setOption(options, true)
        })
        myChart.on('click', (params): void => {
            this.againLoad(params.data.id)
        })
    }

    // 重新渲染图例
    public againLoad = (PdepartId): void => {
        if (echarts.getInstanceByDom(document.getElementById('branchCall') as HTMLDivElement | HTMLCanvasElement)) {
            echarts.getInstanceByDom(document.getElementById('branchCall') as HTMLDivElement | HTMLCanvasElement).dispose()
        }
        const myChart = echarts.init(document.getElementById('branchCall') as HTMLDivElement | HTMLCanvasElement)
        myChart.clear()
        console.log(PdepartId)
        this.state.datalist.map((item): string => {
            if (item.PdepartId === PdepartId) {
                this.state.echartslist.map((itemechats, index): string => {
                    if (itemechats.DepartId === PdepartId) {
                        this.state.echartslist.splice(index, 1)
                    }
                    return ''
                })
                this.state.echartslist.push(item)
            }
            return ''
        })
        console.log(this.state.echartslist)
        this.chartCall()
    }


    // 获取右侧菜单
    public getRightOperation = async (): Promise<void> => {
        const res: any = await _getrightOperation({
            params: {
                parent_id: '1022610110505000000',
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
                view_id: '9112636110600000000',
                type: '0'
            }
        })
        if (res && res.result) {
            this.setState({ mediaColumns: formatColumns(res.data) })
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
        }
    }

    // 处理修改
    public arrayToTree = (list, pid = '0'): any => (
        list.filter((item): boolean => item.PdepartId === pid).map((item): void => ({
            ...item,
            children: this.arrayToTree(list, item.DepartId)
        }))
    )

    // 去掉空的子类
    public IterationDelateMenuChildren = (arr): any => {
        if (arr.length) {
            for (const i in arr) {
                if (arr[i].children.length) {
                    this.IterationDelateMenuChildren(arr[i].children)
                } else {
                    delete arr[i].children
                }
            }
        }
        return arr
    }

    // 导出接口
    public chartExport = async (): Promise<void> => {
        /* const data = [
            { DepartId: '1', PdepartId: '0', DepartMentName: '上海', CallIn: '1', CallOut: '3', TotalCount: '5', CallInLen: '5', TotalLen: '6', AvgCallLen: '9' },
            { DepartId: '2', PdepartId: '1', DepartMentName: '上海2', CallIn: '1', CallOut: '3', TotalCount: '5', CallInLen: '5', TotalLen: '6', AvgCallLen: '9' },
            { DepartId: '3', PdepartId: '1', DepartMentName: '上海3', CallIn: '1', CallOut: '3', TotalCount: '5', CallInLen: '5', TotalLen: '6', AvgCallLen: '9' },
            { DepartId: '4', PdepartId: '1', DepartMentName: '上海4', CallIn: '1', CallOut: '3', TotalCount: '5', CallInLen: '5', TotalLen: '6', AvgCallLen: '9' },
            { DepartId: '5', PdepartId: '1', DepartMentName: '上海5', CallIn: '1', CallOut: '3', TotalCount: '5', CallInLen: '5', TotalLen: '6', AvgCallLen: '9' },
            { DepartId: '6', PdepartId: '2', DepartMentName: '上海6', CallIn: '1', CallOut: '3', TotalCount: '5', CallInLen: '5', TotalLen: '6', AvgCallLen: '9' },
            { DepartId: '7', PdepartId: '2', DepartMentName: '上海7', CallIn: '1', CallOut: '3', TotalCount: '5', CallInLen: '5', TotalLen: '6', AvgCallLen: '9' },
            { DepartId: '8', PdepartId: '2', DepartMentName: '上海8', CallIn: '1', CallOut: '3', TotalCount: '5', CallInLen: '5', TotalLen: '6', AvgCallLen: '9' },
            { DepartId: '9', PdepartId: '3', DepartMentName: '上海9', CallIn: '1', CallOut: '3', TotalCount: '5', CallInLen: '5', TotalLen: '6', AvgCallLen: '9' },
            { DepartId: '10', PdepartId: '3', DepartMentName: '上海10', CallIn: '1', CallOut: '3', TotalCount: '5', CallInLen: '5', TotalLen: '6', AvgCallLen: '9' },
            { DepartId: '11', PdepartId: '3', DepartMentName: '上海', CallIn: '1', CallOut: '3', TotalCount: '5', CallInLen: '5', TotalLen: '6', AvgCallLen: '9' },
            { DepartId: '12', PdepartId: '4', DepartMentName: '上海', CallIn: '1', CallOut: '3', TotalCount: '5', CallInLen: '5', TotalLen: '6', AvgCallLen: '9' },
            { DepartId: '13', PdepartId: '4', DepartMentName: '上海', CallIn: '1', CallOut: '3', TotalCount: '5', CallInLen: '5', TotalLen: '6', AvgCallLen: '9' },
            { DepartId: '14', PdepartId: '13', DepartMentName: '上海', CallIn: '1', CallOut: '3', TotalCount: '5', CallInLen: '5', TotalLen: '6', AvgCallLen: '9' }
        ]
        console.log(this.arrayToTree(data)) */
        const myChart = echarts.init(document.getElementById('branchCall') as HTMLDivElement | HTMLCanvasElement)
        const picInfo = myChart.getDataURL({})
        const res: any = await _exportDaily({
            query_id: this.state.query_id,
            picture: picInfo
        })
        if (res !== '') {
            if (window.navigator.msSaveOrOpenBlob) {
                // 兼容ie11
                try {
                    const blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
                    window.navigator.msSaveOrOpenBlob(blob, `${intl.get('M26P102261011050100P001').d('部门呼叫统计报表.xlsx')}`)
                } catch (e) {
                    console.log(e)
                }
            } else {
                console.log(res)
                // 这里res.data是返回的blob对象
                const blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
                const link = document.createElement('a')
                link.download = `${intl.get('M26P102261011050100P001').d('部门呼叫统计报表.xlsx')}`
                link.href = window.URL.createObjectURL(blob)
                link.click()
            }
        }
    }

    // 选中的部门处理
    public departmentonChange = (data: any): any => {
        const datas = []
        for (const item1 of data) {
            for (const item of this.state.departmentList) {
                if (item1 === item.system_id) {
                    datas.push({
                        departmentId: item.system_id,
                        parentDepartmentId: item.parent_id
                    })
                }
            }
        }
        return datas
    }

    // 选中全部的部门处理
    public departmenton = (): any => {
        const datas = []
        for (const item of this.state.departmentList) {
            datas.push({
                departmentId: item.system_id,
                parentDepartmentId: item.parent_id
            })
        }
        return datas
    }

    // 这里是统计条件的接口
    public handleStatisticsQuery = async (): Promise<void> => {
        let extensions
        if (this.state.extension === 1) {
            /* extensions = JSON.stringify(this.departmenton()).replace(/"/g, "'") */
            extensions = ''
        } else if (this.state.extension === 2) {
            extensions = JSON.stringify(this.departmentonChange(this.state.department)).replace(/"/g, "'")
        }
        /* const datas = {
            begin: moment(this.state.rangeTime[0]).utc().format('YYYYMMDDHHmmss'),
            end: moment(this.state.rangeTime[1]).utc().format('YYYYMMDDHHmmss'),
            department: extensions
        }
        console.log(datas) */
        const res: any = await _getDailyCallForm({
            report_number: 5,
            begin: moment(this.state.rangeTime[0]).utc().format('YYYYMMDDHHmmss'),
            end: moment(this.state.rangeTime[1]).utc().format('YYYYMMDDHHmmss'),
            query_type: 1,
            department: extensions
        })
        console.log(JSON.parse(res.data).length > 0)
        if (res.data !== '' && res.result && res.data !== '[]' && res.data !== 'null' && res.data !== null) {
            const data = JSON.parse(res.data)
            const dataEcharts = []
            data.forEach((item: any): void => {
                item.key = Math.random()
                if (item.PdepartId === '0') {
                    dataEcharts.push(item)
                }
            })
            console.log(data)
            console.log(this.IterationDelateMenuChildren(this.arrayToTree(data)))
            this.setState({
                dataSource: this.IterationDelateMenuChildren(this.arrayToTree(data)),
                datalist: data,
                echartslist: dataEcharts,
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

    // 获取用户坐席工号数据树菜单
    public getExtension = async (): Promise<void> => {
        const res: any = await _queryDepart({
            params: {
                type: 1
            }
        })
        if (res && res.result && res.data.length > 0) {
            this.setState({ workerNumberData: departmentTreeData(res.data) })
        }
    }

    // 获取用户坐席工号list菜单
    public getUser = async (): Promise<void> => {
        const res: any = await _queryDepart({
            params: {
                type: 2
            }
        })
        if (res && res.result && res.data.length > 0) {
            this.setState({ departmentList: res.data })
        }
    }

    public render(): React.ReactElement {
        return (
            <div className={styles.main}>
                <div id="branchCallTable" className={styles.contentLeft}>
                    {/* <Table
                        className={styles.table}
                        scroll={{ x: true, y: 'max-content' }}
                        columns={this.state.mediaColumns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                    /> */}
                    {
                        this.state.dataSource.length > 0 &&
                        <React.Fragment>
                            <div id="branchCall" className={styles.chartWrapper} />
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
                        <Col span={6}>{intl.get('M26P102261011050100ML001').d('分机查询方式')}</Col>
                        <Col span={18}>
                            <Radio.Group value={this.state.extension} onChange={(e): void => { this.setState({ extension: e.target.value }) }}>
                                <Radio value={1}>{intl.get('M26P102261011050100ML002').d('所拥有的部门')}</Radio>
                                <Radio value={2}>{intl.get('M26P102261011050100ML003').d('部门')}</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                    {this.state.extension === 2 ?
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={6}>{intl.get('M26P102261011050100ML003').d('部门')}</Col>
                            <Col span={18}>
                                <TreeSelect
                                    treeData={this.state.workerNumberData}
                                    value={this.state.department}
                                    maxTagCount={3}
                                    onChange={(value: string[]): void => { this.setState({ department: value }) }}
                                    treeCheckable="true"
                                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                                    searchPlaceholder={intl.get('M26P102261011050100ML004').d('请选择部门')}
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

export default BranchCallForm