import * as React from 'react'
import intl from 'react-intl-universal'
import { Base64 } from 'js-base64'
import echarts from 'echarts'
import { Select, Card, Descriptions, Progress, Row, Col } from 'antd'
import DraggableModal from '../../../components/cores/draggableModal/draggableModal'
import RightOperation from '../../../components/containers/right-operation/rightOperation'
import { _serverList, _getRightOperation, _getWebsocketUrl } from '../../../common/api/resourceMonitor'
import styles from './equipment.module.less'

interface IState {
    rightOperationData: any[]; // 右侧按钮
    visible: boolean; // modal开关
    serverList: any[]; // 服务器列表
    serverID: string[]; // 临时选中的服务器
    selectedServerID: string[]; // 当前选中的服务器
    passWay: any; // ws返回的通道信息
    wsReturnData: any; // 不同服务器ws返回的值
    passWayList: any; // 列表时，不同服务器ws返回的通道信息
    wsReturnDataList: any; // 列表时，不同服务器ws返回的值
}

let url: string
let ws: WebSocket
const wss = {}

// 磁盘图option
const getOption = (pecent: number, text: string): any => ({
    title: {
        text,
        left: 'center',
        bottom: '5%',
        textStyle: { color: '#1890ff' }
    },
    series: [{
        type: 'pie',
        radius: ['60%', '80%'],
        startAngle: 225,
        hoverAnimation: false,
        avoidLabelOverlap: false,
        legendHoverLink: false,
        labelLine: { show: false },
        color: ['#1890ff', 'none'],
        data: [{
            value: 75,
            name: ''
        }, {
            value: 25,
            name: ''
        }]
    }, {
        name: '',
        type: 'pie',
        radius: ['55%', '56%'],
        startAngle: 225,
        hoverAnimation: false,
        legendHoverLink: false,
        // color: ['#ff6100', 'none'],
        labelLine: { show: false },
        data: [{
            value: 75,
            name: ''
        }, {
            value: 25,
            name: ''
        }]
    }, {
        name: '',
        type: 'pie',
        radius: ['60%', '80%'],
        startAngle: 315,
        hoverAnimation: false,
        legendHoverLink: false,
        labelLine: { show: false },
        clockwise: false,
        z: 2,
        data: [{
            name: '',
            value: ((100 - pecent * 100) * 270) / 360,
            label: {
                formatter: `${(pecent * 100).toFixed(1)}%`,
                position: 'center',
                show: true,
                color: '#1890ff',
                fontSize: 40
            },
            itemStyle: {
                color: 'rgba(34, 34, 34, .9)'
            }
        },
        {
            value: 1,
            name: '',
            itemStyle: {
                color: '#ff6100',
                borderColor: '#ff6100',
                borderWidth: 1
            }
        },
        {
            name: '',
            value: 100 - ((100 - pecent * 100) * 270) / 360,
            itemStyle: {
                color: 'transparent'
            }
        }]
    }]
})

class Equipment extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            rightOperationData: [],
            visible: false,
            serverList: [],
            serverID: ['0'],
            selectedServerID: ['0'],
            passWay: false,
            wsReturnData: false,
            passWayList: false,
            wsReturnDataList: false
        }
    }

    public componentDidMount(): void {
        this.getRightOperation()
        this.getServerList()
    }

    public componentWillUnmount(): void {
        if (ws) {
            ws.close()
        }
        Object.keys(wss).forEach((key: string): void => {
            wss[key].close()
        })
    }

    // 获取右侧菜单
    public getRightOperation = async (): Promise<void> => {
        const res: any = await _getRightOperation({
            params: {
                parent_id: '1022610110303000000',
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

    // 获取服务器列表
    public getServerList = async (): Promise<void> => {
        const res: any = await _serverList()
        if (res && res.result && res.data.length > 0) {
            this.setState({
                serverList: res.data,
                selectedServerID: res.data.length === 1 ? [res.data[0].system_id] : ['0']
            }, (): void => {
                _getWebsocketUrl({
                    params: { server_id: this.state.serverList[0].system_id }
                }).then((response: any): void => {
                    if (response && response.result) {
                        url = `ws://${JSON.parse(response.data)[0].ip}:${JSON.parse(response.data)[0].port}/G1103100`
                        this.equipmentChange()
                    }
                })
            })
        }
    }

    public equipmentChange = (): void => {
        if (ws) {
            ws.close()
        }
        for (const item of this.state.serverList) {
            if (wss[item.system_id]) {
                wss[item.system_id].close()
                delete wss[item.system_id]
            }
        }
        setTimeout((): void => {
            if (this.state.selectedServerID[0] === '0') { // 选择全部设备时
                for (const item of this.state.serverList) {
                    wss[item.system_id] = new WebSocket(url)
                    this.openWebSockets(wss[item.system_id], item.system_id)
                }
            } else if (this.state.selectedServerID.length === 1) { // 选择一个设备时
                this.openWebSocket()
            } else {
                for (const item of this.state.selectedServerID) {
                    wss[item] = new WebSocket(url)
                    this.openWebSockets(wss[item], item)
                }
            }
        }, 50)
    }

    // 与ws建立连接
    public openWebSocket = (): void => {
        if (!ws) {
            ws = new WebSocket(url)
            this.openWebSocket()
        }
        if (ws.readyState === 0) {
            ws.onopen = (): void => {
                this.openWebSocket()
            }
        } else if (ws.readyState === 1) {
            let sendMsg = {
                code: '1103201',
                data: this.state.selectedServerID[0],
                msg: 'S2',
                result: true
            }
            ws.send(JSON.stringify(sendMsg))
            sendMsg = {
                code: '1103101',
                data: this.state.selectedServerID[0],
                msg: 'S2',
                result: true
            }
            ws.send(JSON.stringify(sendMsg))
        } else if (ws.readyState === 2 || ws.readyState === 3) {
            ws = new WebSocket(url)
            this.openWebSocket()
        }
        ws.onmessage = (e: any): void => {
            if (JSON.parse(e.data).msg === 'RN') {
                if (JSON.parse(e.data).code === 1103101) { // 基本信息
                    const data = JSON.parse(Base64.decode(JSON.parse(e.data).data))
                    console.log(data)
                    this.setState({
                        wsReturnData: data
                    }, (): void => this.reloadChart())
                }
                if (JSON.parse(e.data).code === 1103201) { // 通道信息
                    const data = JSON.parse(JSON.parse(e.data).data)
                    console.log('通道信息:', data)
                    this.setState({
                        passWay: data
                    }, (): void => this.reloadPasswayChart())
                }
            }
        }
        ws.onclose = (): void => {
            console.log('is closed...')
        }
    }

    // 打开多个ws
    public openWebSockets = (wssID: WebSocket, id: string): void => {
        if (wssID.readyState === 0) {
            wssID.onopen = (): void => {
                this.openWebSockets(wssID, id)
            }
        } else if (wssID.readyState === 1) {
            let sendMsg = {
                code: '1103201',
                data: id,
                msg: 'S2',
                result: true
            }
            wssID.send(JSON.stringify(sendMsg))
            sendMsg = {
                code: '1103101',
                data: id,
                msg: 'S2',
                result: true
            }
            wssID.send(JSON.stringify(sendMsg))
            console.log('发送成功')
        } else if (wssID.readyState === 2 || wssID.readyState === 3) {
            wss[id] = new WebSocket(url)
            this.openWebSockets(wss[id], id)
        }
        wssID.onmessage = (ev: any): void => {
            if (JSON.parse(ev.data).msg === 'RN') {
                if (JSON.parse(ev.data).code === 1103101) { // 基本信息
                    const data = JSON.parse(Base64.decode(JSON.parse(ev.data).data))
                    console.log(data)
                    this.setState((prevState: any): any => ({
                        wsReturnDataList: { ...prevState.wsReturnDataList, [id]: data }
                    }))
                }
                if (JSON.parse(ev.data).code === 1103201) { // 通道信息
                    const data = JSON.parse(JSON.parse(ev.data).data)
                    console.log('通道信息:', data)
                    this.setState((prevState: any): any => ({
                        passWayList: { ...prevState.passWayList, [id]: data }
                    }), (): void => console.log(this.state.passWayList))
                }
            }
        }
        wssID.onclose = (): void => {
            console.log('is closed...')
        }
    }

    // 重新渲染cpu,arm,磁盘
    public reloadChart = (): void => {
        // const chartLength = document.querySelectorAll('#chartContainer')[0].children.length
        // 判断磁盘数量是否有变化
        // if (Array.isArray(this.state.wsReturnData.ReturnInfo.Drivers.Driver)) {
        //     if (chartLength > this.state.wsReturnData.ReturnInfo.Drivers.Driver.length) {
        //         for (let i = this.state.wsReturnData.ReturnInfo.Drivers.Driver.length; i < chartLength; i++) {
        //             document.querySelectorAll('#chartContainer')[0].removeChild(document.querySelectorAll('#chartContainer')[0].children[i])
        //         }
        //     }
        // } else {
        //     for (let i = 0; i < chartLength; i++) {
        //         if (document.querySelectorAll('#chartContainer')[0].children[i].id !== this.state.wsReturnData.ReturnInfo.Drivers.Driver['@Name']) {
        //             document.querySelectorAll('#chartContainer')[0].removeChild(document.querySelectorAll('#chartContainer')[0].children[i])
        //         }
        //     }
        // }
        // 磁盘
        if (Array.isArray(this.state.wsReturnData.ReturnInfo.Drivers.Driver)) {
            this.state.wsReturnData.ReturnInfo.Drivers.Driver.forEach((item: any): void => {
                if (!echarts.getInstanceByDom(document.getElementById(item['@Name']) as HTMLDivElement | HTMLCanvasElement)) {
                    const chart = echarts.init(document.getElementById(item['@Name']) as HTMLDivElement | HTMLCanvasElement)
                    this.initDiskChart(chart, item)
                    window.addEventListener('resize', (): void => { chart.resize() })
                } else {
                    this.initDiskChart(echarts.getInstanceByDom(document.getElementById(item['@Name']) as HTMLDivElement | HTMLCanvasElement), item)
                }
            })
        } else {
            const name = this.state.wsReturnData.ReturnInfo.Drivers.Driver['@Name']
            if (!echarts.getInstanceByDom(document.getElementById(name) as HTMLDivElement | HTMLCanvasElement)) {
                const chart = echarts.init(document.getElementById(name) as HTMLDivElement | HTMLCanvasElement)
                this.initDiskChart(chart, this.state.wsReturnData.ReturnInfo.Drivers.Driver)
                window.addEventListener('resize', (): void => { chart.resize() })
            } else {
                this.initDiskChart(echarts.getInstanceByDom(document.getElementById(name) as HTMLDivElement | HTMLCanvasElement), this.state.wsReturnData.ReturnInfo.Drivers.Driver)
            }
        }
        // cpu
        if (!echarts.getInstanceByDom(document.getElementById('cpu') as HTMLDivElement | HTMLCanvasElement)) {
            const chart = echarts.init(document.getElementById('cpu') as HTMLDivElement | HTMLCanvasElement)
            this.initCpuChart(chart)
            window.addEventListener('resize', (): void => { chart.resize() })
        } else {
            this.initCpuChart(echarts.getInstanceByDom(document.getElementById('cpu') as HTMLDivElement | HTMLCanvasElement))
        }
        // 内存
        if (!echarts.getInstanceByDom(document.getElementById('ram') as HTMLDivElement | HTMLCanvasElement)) {
            const chart = echarts.init(document.getElementById('ram') as HTMLDivElement | HTMLCanvasElement)
            this.initRamChart(chart)
            window.addEventListener('resize', (): void => { chart.resize() })
        } else {
            this.initRamChart(echarts.getInstanceByDom(document.getElementById('ram') as HTMLDivElement | HTMLCanvasElement))
        }
    }

    // 重新渲染通道
    public reloadPasswayChart = (): void => {
        if (!echarts.getInstanceByDom(document.getElementById('@P07') as HTMLDivElement | HTMLCanvasElement)) {
            const chart = echarts.init(document.getElementById('@P07') as HTMLDivElement | HTMLCanvasElement)
            this.initPasswayChart(chart, intl.get('M26P1022610110303000T001').d('注册数'), this.state.passWay.ReturnInfo['@P07'])
            window.addEventListener('resize', (): void => { chart.resize() })
        } else {
            this.initPasswayChart(echarts.getInstanceByDom(document.getElementById('@P07') as HTMLDivElement | HTMLCanvasElement), intl.get('M26P1022610110303000T001').d('注册数'), this.state.passWay.ReturnInfo['@P07'])
        }
        if (!echarts.getInstanceByDom(document.getElementById('@P08') as HTMLDivElement | HTMLCanvasElement)) {
            const chart = echarts.init(document.getElementById('@P08') as HTMLDivElement | HTMLCanvasElement)
            this.initPasswayChart(chart, intl.get('M26P1022610110303000T002').d('最大许可数'), this.state.passWay.ReturnInfo['@P08'])
            window.addEventListener('resize', (): void => { chart.resize() })
        } else {
            this.initPasswayChart(echarts.getInstanceByDom(document.getElementById('@P08') as HTMLDivElement | HTMLCanvasElement), intl.get('M26P1022610110303000T002').d('最大许可数'), this.state.passWay.ReturnInfo['@P08'])
        }
        if (!echarts.getInstanceByDom(document.getElementById('@P09') as HTMLDivElement | HTMLCanvasElement)) {
            const chart = echarts.init(document.getElementById('@P09') as HTMLDivElement | HTMLCanvasElement)
            this.initPasswayChart(chart, intl.get('M26P1022610110303000T003').d('当前使用数'), this.state.passWay.ReturnInfo['@P09'])
            window.addEventListener('resize', (): void => { chart.resize() })
        } else {
            this.initPasswayChart(echarts.getInstanceByDom(document.getElementById('@P09') as HTMLDivElement | HTMLCanvasElement), intl.get('M26P1022610110303000T003').d('当前使用数'), this.state.passWay.ReturnInfo['@P09'])
        }
    }

    // 绘制磁盘图
    public initDiskChart = (chart: echarts.ECharts, item: any): void => {
        const total = Math.round(parseInt(item['@TotalSize'], 10) / 1024 / 1024 / 1024 * 10) / 10
        const free = Math.round(parseInt(item['@TotalFreeSpace'], 10) / 1024 / 1024 / 1024 * 10) / 10
        const used = Math.round(total - free)
        const per = Math.round(used / total * 1000) / 1000
        const text = `${item['@Name']}${item['@VolumeLabel']}\n\n${free}GB/${total}GB`
        const option = getOption(per, text)
        chart.setOption(option)
    }

    // 绘制cpu图
    public initCpuChart = (chart: echarts.ECharts): void => {
        const value = parseInt(this.state.wsReturnData.ReturnInfo['@CPUUsage'], 10)
        const option = {
            series: [{
                name: 'CPU占用率',
                type: 'gauge',
                detail: {
                    formatter: '{value}%\n\nCPU',
                    offsetCenter: [0, '100%'],
                    fontSize: 18
                },
                data: [{ value }],
                axisLine: {
                    lineStyle: {
                        color: [[0.2, '#00ff00'], [0.5, '#1890ff'], [0.8, '#ff6100'], [1, '#c23531']]
                    }
                }
            }]
        }
        chart.setOption(option)
    }

    // 绘制内存图
    public initRamChart = (chart: echarts.ECharts): void => {
        const value: number = Math.round((1 - parseInt(this.state.wsReturnData.ReturnInfo['@MemAvailable'], 10) / parseInt(this.state.wsReturnData.ReturnInfo['@MemTotal'], 10)) * 1000) / 10
        const total = Math.round(parseInt(this.state.wsReturnData.ReturnInfo['@MemTotal'], 10) / 1024 / 1024 / 1024 * 10) / 10
        const available = Math.round(parseInt(this.state.wsReturnData.ReturnInfo['@MemAvailable'], 10) / 1024 / 1024 / 1024 * 10) / 10
        const used = Math.round((total - available) * 10) / 10
        const option = {
            series: [{
                name: '内存占用率',
                type: 'gauge',
                detail: {
                    formatter: `${used} GB / ${total} GB\n\nMemory`,
                    offsetCenter: [0, '100%'],
                    fontSize: 18
                },
                data: [{ value }],
                axisLine: {
                    lineStyle: {
                        color: [[0.2, '#00ff00'], [0.5, '#1890ff'], [0.8, '#ff6100'], [1, '#c23531']]
                    }
                }
            }]
        }
        chart.setOption(option)
    }

    // 绘制通道图
    public initPasswayChart = (chart: echarts.ECharts, text: string, value: any): void => {
        const option = {
            title: {
                text,
                left: 'center',
                bottom: '0%',
                textStyle: { color: '#1890ff' }
            },
            series: [{
                type: 'pie',
                radius: ['50%', '65%'],
                color: ['#1890ff'],
                data: [{
                    value,
                    label: {
                        formatter: '{c}',
                        position: 'center',
                        show: true,
                        color: text === intl.get('M26P1022610110303000T003').d('当前使用数') ? '#ff6100' : '#1890ff',
                        fontSize: 50
                    }
                }]
            }]
        }
        chart.setOption(option)
    }

    public handleConfirm = (): void => {
        if (this.state.serverID.length === 0 || this.state.selectedServerID === this.state.serverID) {
            this.setState({ visible: false })
            return
        }
        this.setState((prevState: any): any => ({
            selectedServerID: prevState.serverID,
            visible: false
        }), (): void => this.equipmentChange())
    }

    // 右侧菜单操作
    public rightIdData = (data: any): void => {
        switch (data.P003) {
            case 'OP102261011030301':
                this.setState({ visible: true })
                break
            case 'OP102261011030309':
                this.equipmentChange()
                break
            default:
                break
        }
    }

    public handleSelectChange = (value: string[]): void => {
        if (value[0] === '0' && value.length > 1) {
            value.splice(0, 1)
            this.setState({ serverID: value })
        } else if (value.includes('0')) {
            this.setState({ serverID: ['0'] })
        } else {
            this.setState({ serverID: value })
        }
    }

    public render(): React.ReactElement {
        // 百分比
        const pecent = (t: string, a: string): number => {
            const value: number = Math.round((1 - parseInt(a, 10) / parseInt(t, 10)) * 1000) / 10
            return value
        }
        // 可用空间
        const available = (t: string, a: string): string => {
            const total = Math.round(parseInt(t, 10) / 1024 / 1024 / 1024 * 10) / 10
            const avai = Math.round(parseInt(a, 10) / 1024 / 1024 / 1024 * 10) / 10
            return `${avai}GB / ${total}GB`
        }
        const color = (p: number): string => {
            if (p <= 20) {
                return '#00ff00'
            }
            if (p > 20 && p <= 70) {
                return '#108ee9'
            }
            return '#87d068'
        }

        // 渲染列表中磁盘空间部分
        const renderDisk = (diskList: any[]): React.ReactElement[] => {
            const list: React.ReactElement[] = []
            if (Array.isArray(diskList)) {
                diskList.forEach((item: any): void => {
                    list.push(
                        <div key={item['@Name']}>
                            <p>
                                {item['@Name']}
                                &nbsp;
                                {item['@VolumeLabel']}
                            </p>
                            <Progress strokeWidth={16} strokeColor={color(pecent(item['@TotalSize'], item['@TotalFreeSpace']))} style={{ width: 280 }} percent={pecent(item['@TotalSize'], item['@TotalFreeSpace'])} />
                            <p>
                                {available(item['@TotalSize'], item['@TotalFreeSpace'])}
                            </p>
                        </div>
                    )
                })
            } else {
                list.push(
                    <div key={diskList['@Name']}>
                        <p>
                            {diskList['@Name']}
                            &nbsp;
                            {diskList['@VolumeLabel']}
                        </p>
                        <Progress strokeWidth={16} strokeColor={color(pecent(diskList['@TotalSize'], diskList['@TotalFreeSpace']))} style={{ width: 280 }} percent={pecent(diskList['@TotalSize'], diskList['@TotalFreeSpace'])} />
                        <p>
                            {available(diskList['@TotalSize'], diskList['@TotalFreeSpace'])}
                        </p>
                    </div>
                )
            }
            return list
        }

        const renderRecordType = (type: string): string => {
            switch (type) {
                case '65':
                    return intl.get('BDN260212601001').d('模拟线')
                case '68':
                    return intl.get('BDN260212601002').d('数字线')
                case '73':
                    return intl.get('BDN260212601003').d('VoIP')
                case '133':
                    return intl.get('BDN260212601004').d('模拟+数字')
                case '153':
                    return intl.get('BDN260212601005').d('E1/T1 中继线')
                default:
                    return type
            }
        }

        return (
            <div className={styles.main}>
                {
                    this.state.selectedServerID[0] !== '0' && this.state.selectedServerID.length === 1 ?
                        <div className={styles.wrapper}>
                            <div className={styles.header}>{intl.get('M26P1022610110303000T008').d('处理器&内存')}</div>
                            <div className={styles.CRWrapper}>
                                <div id="cpu" className={styles.crWrapper} />
                                <div id="ram" className={styles.crWrapper} />
                            </div>
                            <div className={styles.header}>{intl.get('M26P1022610110303000T009').d('磁盘空间')}</div>
                            <div id="chartContainer" className={styles.diskWrapper}>
                                {
                                    this.state.wsReturnData &&
                                    (Array.isArray(this.state.wsReturnData.ReturnInfo.Drivers.Driver) ?
                                        this.state.wsReturnData.ReturnInfo.Drivers.Driver.map((item: any): React.ReactElement => (
                                            <div key={item['@Name']} id={item['@Name']} className={styles.chartWrapper} />
                                        )) :
                                        <div key={this.state.wsReturnData.ReturnInfo.Drivers.Driver['@Name']} id={this.state.wsReturnData.ReturnInfo.Drivers.Driver['@Name']} className={styles.chartWrapper} />)
                                }
                            </div>
                            <div className={styles.header}>
                                {intl.get('M26P102261011010000ML004').d('录音类型')}
                                {
                                    this.state.passWay && renderRecordType(this.state.passWay.ReturnInfo['@P06'])
                                }
                            </div>
                            <div className={styles.passwayWrapper}>
                                <div id="@P07" className={styles.chartWrapper} />
                                <div id="@P08" className={styles.chartWrapper} />
                                <div id="@P09" className={styles.chartWrapper} />
                            </div>
                        </div> :
                        <div className={styles.list}>
                            {
                                this.state.serverList.map((item: any): React.ReactElement => (
                                    this.state.wsReturnDataList &&
                                    <Card key={item.system_id} title={item.server_name} className={styles.listCard}>
                                        <Descriptions title={intl.get('M26P1022610110303000T011').d('处理器')}>
                                            <Descriptions.Item>
                                                <Progress strokeWidth={16} strokeColor={color(parseInt(this.state.wsReturnDataList[item.system_id].ReturnInfo['@CPUUsage'], 10))} style={{ width: 280 }} percent={parseInt(this.state.wsReturnDataList[item.system_id].ReturnInfo['@CPUUsage'], 10)} />
                                            </Descriptions.Item>
                                        </Descriptions>
                                        <Descriptions title={intl.get('M26P1022610110303000T012').d('内存')}>
                                            <Descriptions.Item>
                                                <Progress strokeWidth={16} strokeColor={color(pecent(this.state.wsReturnDataList[item.system_id].ReturnInfo['@MemTotal'], this.state.wsReturnDataList[item.system_id].ReturnInfo['@MemAvailable']))} style={{ width: 280 }} percent={pecent(this.state.wsReturnDataList[item.system_id].ReturnInfo['@MemTotal'], this.state.wsReturnDataList[item.system_id].ReturnInfo['@MemAvailable'])} />
                                                <p>{available(this.state.wsReturnDataList[item.system_id].ReturnInfo['@MemTotal'], this.state.wsReturnDataList[item.system_id].ReturnInfo['@MemAvailable'])}</p>
                                            </Descriptions.Item>
                                        </Descriptions>
                                        <Descriptions title={intl.get('M26P1022610110303000T009').d('磁盘空间')} column={1}>
                                            <Descriptions.Item>
                                                {
                                                    renderDisk(this.state.wsReturnDataList[item.system_id].ReturnInfo.Drivers.Driver)
                                                }
                                            </Descriptions.Item>
                                        </Descriptions>
                                        {
                                            this.state.passWayList &&
                                            <Descriptions title={`${intl.get('M26P1022610110303000T013').d('通道信息')}：${renderRecordType(this.state.passWayList[item.system_id].ReturnInfo['@P06'])}`} column={1}>
                                                <Descriptions.Item>
                                                    <p>
                                                        {intl.get('M26P1022610110303000T001').d('注册数')}
                                                        {this.state.passWayList[item.system_id].ReturnInfo['@P07']}
                                                    </p>
                                                    <p>
                                                        {intl.get('M26P1022610110303000T002').d('最大许可数')}
                                                        {this.state.passWayList[item.system_id].ReturnInfo['@P08']}
                                                    </p>
                                                    <p>
                                                        {intl.get('M26P1022610110303000T003').d('当前使用数')}
                                                        {this.state.passWayList[item.system_id].ReturnInfo['@P09']}
                                                    </p>
                                                </Descriptions.Item>
                                            </Descriptions>
                                        }
                                    </Card>
                                ))
                            }
                        </div>
                }
                <RightOperation rightOperationData={this.state.rightOperationData} operateCallBack={(data): void => this.rightIdData(data)} />

                <DraggableModal
                    title={intl.get('M26P1022610110303000M001').d('选择设备')}
                    width={400}
                    visible={this.state.visible}
                    onCancel={(): void => this.setState({ visible: false })}
                    onOk={(): void => this.handleConfirm()}
                >
                    <Row>
                        <Col span={6}>{intl.get('M26P1022610110303000M001').d('选择设备')}</Col>
                        <Col span={18}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                value={this.state.serverID}
                                onChange={this.handleSelectChange}
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
                </DraggableModal>
            </div>
        )
    }
}

export default Equipment