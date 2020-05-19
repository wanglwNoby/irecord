import * as React from 'react'
import { Tree } from 'antd'
import intl from 'react-intl-universal'
import RightOperation from '../../components/containers/right-operation/rightOperation'
import DraggableModal from '../../components/cores/draggableModal/draggableModal'
import { _getOrg, _getLocalMachine, _getRecordConfig, _getrightOperation } from '../../common/api/siteManage'
import { _addLicence, _addRecord, _addMonitor, _addFileDelete, _getMasterServer } from '../../common/api/serverConfig'
import License from './licence'
import RecordService from './recordService'
import MonitorConfig from './monitor'
import FileDeleteConfig from './fileDelete'
import LicenceInfo from './licence/licenceInfo'
import MonitorInfo from './monitor/monitorInfo'
import FileDeleteInfo from './fileDelete/fileDeleteInfo'
import RecordServiceInfo from './recordService/recordServiceInfo'
import styles from './index.module.less'

class ServerConfig extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            orgData: [],
            rightOperationData: [],
            checkedKeys: '',
            localMachineInfo: {
                params: {
                    system_id: 270
                }
            },
            licenceVisible: false,
            recordVisible: false,
            monitorVisible: false,
            fileDeleteVisible: false,
            serverData: [],
            storageList: [],
            DBBirdgeList: [],
            licenData: [],
            recordData: [],
            recordIpData: [],
            monitorData: [],
            licenceInfoData: [],
            recordInfoData: [],
            monitorInfoData: [],
            fileDeleteInfoData: [],
            editType: 1,
            masterData: [],
            currentServer: [], // 点击这些服务获取的上一级服务器信息
            FuctionId: ''
        }
    }

    public componentDidMount(): void {
        this.getOrg()
    }

    public rightIdData = (data): void => {
        this.setState({
            FuctionId: data.P005
        }, (): void => {
            console.log(this.state.FuctionId)
        })
        if (this.state.checkedKeys === '284') {
            this.getserverList()
            this.setState({
                licenceVisible: true
            })
            if (this.state.licenceInfoData === 'null') {
                this.getserverList()
                this.setState({
                    licenceVisible: true,
                    editType: 1
                })
            } else {
                this.getserverList()
                this.setState({
                    licenceVisible: true,
                    editType: 2
                })
            }
        } else if (this.state.checkedKeys === '271') {
            if (this.state.recordInfoData === 'null') {
                this.getserverList()
                this.getDBBridge()
                this.getstorage()
                this.getMaster()
                this.setState({
                    recordVisible: true,
                    editType: 1
                })
            } else {
                this.getserverList()
                this.getDBBridge()
                this.getstorage()
                this.getMaster()
                this.setState({
                    recordVisible: true,
                    editType: 2
                })
            }
        } else if (this.state.checkedKeys === '276') {
            if (this.state.monitorInfoData === 'null') {
                this.getserverList()
                this.setState({
                    monitorVisible: true,
                    editType: 1
                })
            } else {
                this.getserverList()
                this.setState({
                    monitorVisible: true,
                    editType: 2
                })
            }
            this.getserverList()
            this.setState({
                monitorVisible: true
            })
        } else if (this.state.checkedKeys === '282') {
            if (this.state.fileDeleteInfoData === 'null') {
                this.getserverList()
                this.setState({
                    fileDeleteVisible: true,
                    editType: 1
                })
            } else {
                this.getserverList()
                this.setState({
                    fileDeleteVisible: true,
                    editType: 2
                })
            }
        }
    }

    public onExpand = (keys: any, event: any): void => {
        console.log('Trigger Select', keys, event)
        this.setState({
            siteId: event.node.props.siteId
        }, (): void => {
            console.log(this.state.siteId)
        })
    }

    public onSelect = (keys: any, event: any): void => {
        const key = keys[0].substring(0, 3)
        this.setState({
            checkedKeys: key
        })
        if (key === '104') {
            console.log('这是机构')
            this.setState({
                rightOperationData: []
            })
        } else if (key === '270') {
            console.log('这是站点')
            this.setState({
                siteId: event.node.props.siteId,
                rightOperationData: []
            })
        } else if (key === '289') {
            console.log('这是服务器')
            this.setState({
                siteId: event.node.props.siteId,
                rightOperationData: []
            })
        } else if (key === '284') {
            console.log('这是许可服务')
            this.setState({
                siteId: event.node.props.siteId
            }, (): void => {
                this.getRightOperation()
                this.treeparent(this.state.orgData, event.node.props.eventKey)
            })
        } else if (key === '271') {
            console.log('这是录音服务')
            this.setState({
                siteId: event.node.props.siteId
            }, (): void => {
                this.getRightOperation()
                this.getDBBridge()
                this.getstorage()
                this.treeparent(this.state.orgData, event.node.props.eventKey)
            })
        } else if (key === '276') {
            console.log('这是监听服务')
            this.setState({
                siteId: event.node.props.siteId
            }, (): void => {
                this.getRightOperation()
                this.treeparent(this.state.orgData, event.node.props.eventKey)
            })
        } else if (key === '282') {
            console.log('这是归档回删服务')
            this.setState({
                siteId: event.node.props.siteId
            }, (): void => {
                this.getRightOperation()
                this.treeparent(this.state.orgData, event.node.props.eventKey)
            })
        }
    }

    // 判断点击树的上一级
    public treeparent = async (data, id): Promise<void> => {
        let serverIp
        for (const item of data) {
            if (item.children) {
                for (let k = 0; k < item.children.length; k++) {
                    if (item.children[k].key === id) {
                        serverIp = item.title
                    } else if (k === item.children.length - 1) {
                        this.treeparent(item.children, id)
                    }
                }
            }
        }
        const data1 = {
            params: {
                system_id: 289,
                site_id: this.state.siteId
            }
        }
        const res: any = await _getRecordConfig(data1)
        if (res && res.result && res.data !== 'null') {
            const newData = res.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
            const serverdata = JSON.parse(newData)
            for (const item of serverdata) {
                if (serverIp === item.IPAddress) {
                    this.setState({
                        currentServer: item
                    }, (): void => {
                        this.getInfo()
                    })
                }
            }
        }
    }

    public loadTreeNode = (data: any): any => (
        data.map((item): any => {
            if (item.children) {
                return (
                    <Tree.TreeNode title={item.title} key={item.key} siteId={item.siteId} dataRef={item}>
                        {this.loadTreeNode(item.children)}
                    </Tree.TreeNode>
                )
            }
            return <Tree.TreeNode {...item} dataRef={item} siteId={item.siteId} />
        })
    )

    // 获取右侧菜单
    public getRightOperation = async (): Promise<void> => {
        let deleteType
        if (this.state.checkedKeys === '284') {
            deleteType = '284'
        } else if (this.state.checkedKeys === '271') {
            deleteType = '271'
        } else if (this.state.checkedKeys === '276') {
            deleteType = '276'
        } else if (this.state.checkedKeys === '282') {
            deleteType = '282'
        }
        const rightdata = {
            params: {
                parent_id: '1022610110905000000',
                resource_id: deleteType
            }
        }
        const res: any = await _getrightOperation(rightdata)
        if (res && res.result) {
            const data = res.data[0]
            const rightOperation = (data.P004)
            this.setState({
                rightOperationData: rightOperation
            })
        }
    }

    // 获取站点下的服务器列表
    public getserverList = async (): Promise<void> => {
        const data = {
            params: {
                system_id: 289,
                site_id: this.state.siteId
            }
        }
        const res: any = await _getRecordConfig(data)
        if (res && res.result && res.data !== 'null') {
            const newData = res.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
            const serverdata = JSON.parse(newData)
            this.setState({
                serverData: serverdata
            })
        }
    }

    // 获取master服务器
    public getMaster = async (): Promise<void> => {
        const data = {
            params: {
                site_id: this.state.siteId,
                device_id: this.state.currentServer.deviceid
            }
        }
        const res: any = await _getMasterServer(data)
        if (res && res.result && res.data !== 'null') {
            const newData = res.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
            const serverdata = JSON.parse(newData)
            this.setState({
                masterData: serverdata
            })
        }
    }

    // 获取站点下的存储设备列表
    public getstorage = async (): Promise<void> => {
        const data = {
            params: {
                system_id: 288,
                site_id: this.state.siteId
            }
        }
        const res: any = await _getRecordConfig(data)
        if (res && res.result && res.data !== 'null') {
            const storageData = JSON.parse(res.data)
            this.setState({
                storageList: storageData
            })
        }
    }

    // 获取DBBridge列表
    public getDBBridge = async (): Promise<void> => {
        const data = {
            params: {
                system_id: 273,
                site_id: this.state.siteId
            }
        }
        const res: any = await _getRecordConfig(data)
        if (res && res.result && res.data !== 'null') {
            const DBBirdgeData = JSON.parse(res.data)
            this.setState({
                DBBirdgeList: DBBirdgeData
            })
        }
    }

    // 获取许可服务信息
    public getInfo = async (): Promise<void> => {
        let serviceType
        if (this.state.checkedKeys === '284') {
            serviceType = 284
        } else if (this.state.checkedKeys === '271') {
            serviceType = 271
        } else if (this.state.checkedKeys === '276') {
            serviceType = 276
        } else if (this.state.checkedKeys === '282') {
            serviceType = 282
        }
        const data = {
            params: {
                system_id: serviceType,
                site_id: this.state.siteId,
                guid: this.state.currentServer.guid
            }
        }
        const res: any = await _getRecordConfig(data)
        if (res && res.result && res.data !== 'null') {
            const newData = res.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
            const infodata = JSON.parse(newData)
            if (this.state.checkedKeys === '284') {
                this.setState({
                    licenceInfoData: infodata
                })
            } else if (this.state.checkedKeys === '271') {
                this.setState({
                    recordInfoData: infodata
                })
            } else if (this.state.checkedKeys === '276') {
                this.setState({
                    monitorInfoData: infodata
                })
            } else if (this.state.checkedKeys === '282') {
                this.setState({
                    fileDeleteInfoData: infodata
                })
            }
        } else if (res && res.result) {
            if (this.state.checkedKeys === '284') {
                this.setState({
                    licenceInfoData: []
                })
            } else if (this.state.checkedKeys === '271') {
                this.setState({
                    recordInfoData: []
                })
            } else if (this.state.checkedKeys === '276') {
                this.setState({
                    monitorInfoData: []
                })
            } else if (this.state.checkedKeys === '282') {
                this.setState({
                    fileDeleteInfoData: []
                })
            }
        }
    }

    // 获取顶级机构
    public getOrg = async (): Promise<void> => {
        const res: any = await _getOrg()
        if (res && res.result) {
            const treedata = []
            res.data.forEach((item: any): void => {
                treedata.push({ title: item.full_name, key: `${item.system_id}${Math.floor(Math.random() * 10000000)}` })
            })
            this.setState({
                orgData: treedata
            })
        }
    }

    public onLoadData = (treeNode: any): any => (
        new Promise((resolve): any => {
            if (treeNode.props.children) {
                resolve()
                return
            }
            if (treeNode.props.eventKey.substring(0, 3) === '104') {
                _getLocalMachine(this.state.localMachineInfo).then((res: any): void => {
                    if (res && res.result && res.data !== 'null') {
                        const localMachine = JSON.parse(res.data)
                        const treedata = []
                        localMachine.forEach((item: any): void => {
                            treedata.push({ title: item.full_name, key: `${item.system_id}${Math.floor(Math.random() * 10000000)}`, siteId: item.siteid })
                        })
                        treeNode.props.dataRef.children = treedata
                        this.setState((prevState: any): any => ({
                            orgData: [...prevState.orgData]
                        }))
                    }
                    resolve()
                })
            }
            if (this.state.siteId !== undefined) {
                if (treeNode.props.children) {
                    resolve()
                    return
                }
                const data = {
                    params: {
                        system_id: 289,
                        site_id: this.state.siteId
                    }
                }
                if (treeNode.props.eventKey.substring(0, 3) === '270') {
                    _getRecordConfig(data).then((res: any): void => {
                        if (res && res.result && res.data !== 'null') {
                            const serverData = JSON.parse(res.data)
                            const orgdata = JSON.parse(JSON.stringify(this.state.orgData))
                            const treedata = []
                            serverData.forEach((item: any): void => {
                                treedata.push({ title: item.full_name, key: `${item.system_id}${Math.floor(Math.random() * 10000000)}`, siteId: item.siteid })
                            })
                            for (const item of orgdata[0].children) {
                                for (const item1 of serverData) {
                                    if (item1.siteId === item.siteid) {
                                        if (item.children) {
                                            treeNode.props.dataRef.children = treedata
                                        } else {
                                            treeNode.props.dataRef.children = treedata
                                        }
                                    }
                                }
                            }
                            this.setState((prevState): any => ({
                                orgData: [...prevState.orgData]
                            }))
                        }
                        resolve()
                    })
                }
            }
            if (this.state.siteId !== undefined) {
                if (treeNode.props.children) {
                    resolve()
                    return
                }
                if (treeNode.props.eventKey.substring(0, 3) === '289') {
                    const data = {
                        params: {
                            system_id: 289,
                            site_id: this.state.siteId
                        }
                    }
                    _getRecordConfig(data).then((res: any): void => {
                        if (res && res.result && res.data !== 'null') {
                            const serverData = JSON.parse(res.data)
                            const orgdata = JSON.parse(JSON.stringify(this.state.orgData))
                            for (const item of orgdata[0].children) {
                                for (const item1 of serverData) {
                                    if (item1.siteId === item.siteid) {
                                        if (item.children[0].children) {
                                            treeNode.props.dataRef.children = [
                                                { key: `284${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011090500MT001').d('许可服务')}`, siteId: item.siteId, isLeaf: true },
                                                { key: `271${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011090500MT002').d('录音服务')}`, siteId: item.siteId, isLeaf: true },
                                                { key: `276${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011090500MT003').d('监视监听服务')}`, siteId: item.siteId, isLeaf: true },
                                                { key: `282${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011090500MT004').d('归档回删服务')}`, siteId: item.siteId, isLeaf: true }
                                            ]
                                        } else {
                                            treeNode.props.dataRef.children = [
                                                { key: `284${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011090500MT001').d('许可服务')}`, siteId: item.siteId, isLeaf: true },
                                                { key: `271${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011090500MT002').d('录音服务')}`, siteId: item.siteId, isLeaf: true },
                                                { key: `276${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011090500MT003').d('监视监听服务')}`, siteId: item.siteId, isLeaf: true },
                                                { key: `282${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011090500MT004').d('归档回删服务')}`, siteId: item.siteId, isLeaf: true }
                                            ]
                                        }
                                    }
                                }
                            }
                            this.setState((prevState): any => ({
                                orgData: [...prevState.orgData]
                            }))
                        }
                    })
                }
                resolve()
            }
        })
    )

    public licenceData = (data): void => {
        let type
        if (this.state.licenceInfoData.length === 0) {
            type = 0
        } else {
            type = 284
        }
        const licendata = {
            system_id: type,
            site_id: this.state.siteId,
            license_id: data.licenseId,
            main_standby: data.mainStandby,
            restful_port: data.restfulPort,
            websocket_port: data.websocketPort,
            alias: data.alias,
            guid: this.state.currentServer.guid,
            description: data.description,
            state: data.state === true ? 1 : 0,
            alarm_push: data.alarmPush === true ? 1 : 0,
            log_level: Number(data.logLevel),
            function_id: this.state.FuctionId
        }
        this.setState((): any => ({
            licenData: licendata
        }))
    }

    public handleLicence = (): void => {
        this.addLicence()
    }

    public addLicence = async (): Promise<void> => {
        const res: any = await _addLicence(this.state.licenData)
        if (res && res.result) {
            this.setState({
                licenceVisible: false
            })
            this.getInfo()
        }
    }

    public recordServiceData = (data): void => {
        console.log(data)
        let type
        let serviceId
        if (this.state.recordInfoData.length === 0) {
            type = 0
            serviceId = 0
        } else {
            type = 271
            serviceId = this.state.recordInfoData[0].serviceid
        }
        const recorddata = {
            system_id: type,
            site_id: this.state.siteId,
            master_id: data.masterId,
            restful_port: data.restfulPort,
            websocket_port: data.websocketPort,
            record_type: Number(data.recordType),
            start_delay: data.startDelay,
            concurrent_channel: data.concurrentChannel,
            max_mute_duration: data.maxMuteDuration,
            min_record_duration: data.minRecordDuration,
            max_record_duration: data.maxRecordDuration,
            media_format: Number(data.mediaFormat),
            storage_device: data.storageDevice,
            alias: data.alias,
            db_bridge_id: data.dbBridgeId,
            hash_check_code: data.hashCheckCode === true ? 1 : 0,
            stream_buffer: data.streamBuffer,
            guid: this.state.currentServer.guid,
            push_stream: data.pushStream,
            filing_months: data.filingMonths,
            alarm_push: data.alarmPush === true ? 1 : 0,
            start_archive: data.startArchive === true ? 1 : 0,
            start_delete: data.startDelete === true ? 1 : 0,
            start_encryption: data.startEncryption === true ? 1 : 0,
            description: data.description,
            log_level: Number(data.logLevel),
            state: data.state === true ? 1 : 0,
            service_id: serviceId,
            less_than_record_time: data.lessThanRecordTime,
            more_than_record_time: data.moreThanRecordTime,
            double_track: data.doubleTrack === true ? 1 : 0,
            gate_way_one: null,
            gate_way_two: null,
            gate_way_three: null,
            gate_way_four: null,
            gate_way_five: null,
            gate_way_six: null,
            gate_way_seven: null,
            gate_way_eight: null,
            gate_way_nine: null,
            gate_way_ten: null,
            function_id: this.state.FuctionId
        }
        this.setState((): any => ({
            recordData: recorddata
        }))
    }

    public recordServiceIpData = (data): void => {
        console.log(data)
        this.setState((): any => ({
            recordIpData: data
        }))
    }

    public handleRecordService = (): void => {
        this.addRecordService()
    }

    public addRecordService = async (): Promise<void> => {
        const recordData = JSON.parse(JSON.stringify(this.state.recordData))
        console.log(recordData)
        console.log(this.state.recordIpData[2])
        recordData.gate_way_one = this.state.recordIpData[0] === undefined ? '' : this.state.recordIpData[0]
        recordData.gate_way_two = this.state.recordIpData[1] === undefined ? '' : this.state.recordIpData[1]
        recordData.gate_way_three = this.state.recordIpData[2] === undefined ? '' : this.state.recordIpData[2]
        recordData.gate_way_four = this.state.recordIpData[3] === undefined ? '' : this.state.recordIpData[3]
        recordData.gate_way_five = this.state.recordIpData[4] === undefined ? '' : this.state.recordIpData[4]
        recordData.gate_way_six = this.state.recordIpData[5] === undefined ? '' : this.state.recordIpData[5]
        recordData.gate_way_seven = this.state.recordIpData[6] === undefined ? '' : this.state.recordIpData[6]
        recordData.gate_way_eight = this.state.recordIpData[7] === undefined ? '' : this.state.recordIpData[7]
        recordData.gate_way_nine = this.state.recordIpData[8] === undefined ? '' : this.state.recordIpData[8]
        recordData.gate_way_ten = this.state.recordIpData[9] === undefined ? '' : this.state.recordIpData[9]
        const res: any = await _addRecord(recordData)
        if (res && res.result) {
            this.setState({
                recordVisible: false
            })
            this.getInfo()
        }
    }

    public monitorData = (data): void => {
        let type
        let serviceId
        if (this.state.monitorInfoData.length === 0) {
            type = 0
            serviceId = 0
        } else {
            type = 276
            serviceId = this.state.monitorInfoData[0].serviceid
        }
        const monitordata = {
            system_id: type,
            site_id: this.state.siteId,
            restful_port: data.restfulPort,
            websocket_port: data.websocketPort,
            alias: data.alias,
            guid: this.state.currentServer.guid,
            state: data.state === true ? 1 : 0,
            service_id: serviceId,
            alarm_push: data.alarmPush === true ? 1 : 0,
            log_level: Number(data.logLevel),
            function_id: this.state.FuctionId
        }
        this.setState((): any => ({
            monitorData: monitordata
        }))
    }

    public handleMonitor = (): void => {
        this.addMonitor()
    }

    public addMonitor = async (): Promise<void> => {
        const res: any = await _addMonitor(this.state.monitorData)
        if (res && res.result) {
            this.setState({
                monitorVisible: false
            })
            this.getInfo()
        }
    }

    public fileDeleteData = (data): void => {
        let type
        let serviceId
        console.log(this.state.fileDeleteInfoData)
        if (this.state.fileDeleteInfoData.length === 0) {
            type = 0
            serviceId = 0
        } else {
            type = 282
            serviceId = this.state.fileDeleteInfoData[0].serviceid
        }
        const fileDeletedata = {
            system_id: type,
            site_id: this.state.siteId,
            restful_port: data.restfulPort,
            websocket_port: data.websocketPort,
            alias: data.alias,
            guid: this.state.currentServer.guid,
            state: data.state === true ? 1 : 0,
            file: data.file,
            delete: data.delete,
            service_id: serviceId,
            alarm_push: data.alarmPush === true ? 1 : 0,
            log_level: Number(data.logLevel),
            function_id: this.state.FuctionId
        }
        this.setState((): any => ({
            fileDeleteData: fileDeletedata
        }))
    }

    public handleFileDelete = (): void => {
        this.addFileDelete()
    }

    public addFileDelete = async (): Promise<void> => {
        const res: any = await _addFileDelete(this.state.fileDeleteData)
        if (res && res.result) {
            this.setState({
                fileDeleteVisible: false
            })
            this.getInfo()
        }
    }

    public render(): React.ReactElement {
        return (
            <div className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.contentLeft}>
                        {
                            this.state.orgData.length > 0 &&
                            <Tree.DirectoryTree
                                onExpand={this.onExpand}
                                onSelect={this.onSelect}
                                loadData={this.onLoadData}
                            >
                                {this.loadTreeNode(this.state.orgData)}
                            </Tree.DirectoryTree>
                        }
                    </div>
                    <div className={styles.contentRight}>
                        {this.state.checkedKeys === '284' && this.state.licenceInfoData.length !== 0 ? <LicenceInfo dataInfo={this.state.licenceInfoData[0]} /> : null}
                        {this.state.checkedKeys === '276' && this.state.monitorInfoData.length !== 0 ? <MonitorInfo dataInfo={this.state.monitorInfoData[0]} /> : null}
                        {this.state.checkedKeys === '282' && this.state.fileDeleteInfoData.length !== 0 ? <FileDeleteInfo dataInfo={this.state.fileDeleteInfoData[0]} /> : null}
                        {this.state.checkedKeys === '271' && this.state.recordInfoData.length !== 0 ? <RecordServiceInfo currentServer={this.state.currentServer} dataInfo={this.state.recordInfoData[0]} DBBirdgeList={this.state.DBBirdgeList} storageList={this.state.storageList} /> : null}
                    </div>
                </div>
                <RightOperation rightOperationData={this.state.rightOperationData} operateCallBack={(data): void => this.rightIdData(data)} />
                <DraggableModal
                    visible={this.state.licenceVisible}
                    title={intl.get('M26P102261011090500MT001').d('许可服务')}
                    width={500}
                    onOk={(): void => { this.handleLicence() }}
                    onCancel={(): void => { this.setState({ licenceVisible: false }) }}
                >
                    <License editType={this.state.editType} licenceInfoData={this.state.licenceInfoData} serverList={this.state.serverData} licence={(data): void => this.licenceData(data)} />
                </DraggableModal>
                <DraggableModal
                    visible={this.state.recordVisible}
                    title={intl.get('M26P102261011090500MT002').d('录音服务')}
                    width={500}
                    bodyStyle={{ maxHeight: '500px', overflow: 'auto' }}
                    onOk={(): void => { this.handleRecordService() }}
                    onCancel={(): void => { this.setState({ recordVisible: false }) }}
                >
                    <RecordService editType={this.state.editType} recordInfoData={this.state.recordInfoData} currentServer={this.state.currentServer} masterData={this.state.masterData} serverList={this.state.serverData} storageList={this.state.storageList} DBBirdgeList={this.state.DBBirdgeList} recordServiceIp={(data): void => this.recordServiceIpData(data)} recordService={(data): void => this.recordServiceData(data)} />
                </DraggableModal>
                <DraggableModal
                    visible={this.state.monitorVisible}
                    title={intl.get('M26P102261011090500MT003').d('监视监听服务')}
                    width={500}
                    onOk={(): void => { this.handleMonitor() }}
                    onCancel={(): void => { this.setState({ monitorVisible: false }) }}
                >
                    <MonitorConfig editType={this.state.editType} monitorInfoData={this.state.monitorInfoData} serverList={this.state.serverData} monitor={(data): void => this.monitorData(data)} />
                </DraggableModal>
                <DraggableModal
                    visible={this.state.fileDeleteVisible}
                    title={intl.get('M26P102261011090500MT004').d('归档回删服务')}
                    width={500}
                    onOk={(): void => { this.handleFileDelete() }}
                    onCancel={(): void => { this.setState({ fileDeleteVisible: false }) }}
                >
                    <FileDeleteConfig editType={this.state.editType} fileDeleteInfoData={this.state.fileDeleteInfoData} serverList={this.state.serverData} fileDelete={(data): void => this.fileDeleteData(data)} />
                </DraggableModal>
            </div>
        )
    }
}


export default ServerConfig