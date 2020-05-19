import * as React from 'react'
import { Tree, Button, Modal, message } from 'antd'
import intl from 'react-intl-universal'
import DraggableModal from '../../../components/cores/draggableModal/draggableModal'
import RightOperation from '../../../components/containers/right-operation/rightOperation'
import Basic from '../basic'
import Server from '../server'
import Database from '../database'
import Storage from '../storage'
import Log from './log/log'
import BasicInfo from '../basicInfo/basicInfo'
import ServerInfo from '../serverInfo/serverInfo'
import DatabaseInfo from '../databaseInfo/databaseInfo'
import StorageInfo from '../storageInfo/storageInfo'
import styles from './siteManage.module.less'
import { _addLocalMachine, _addServerDevice, _addDatabase, _addStorage, _getLocalMachine, _getRecordConfig, _getrightOperation, _getOrg, _deleteConfig, _setServerPort, _setLogDirectory, _setLogGrade, _getDriver } from '../../../common/api/siteManage'

interface IState {
    basicVisible: boolean;
    confirmLoading: boolean;
    serverVisible: boolean;
    logVisible: boolean;
    databaseVisible: boolean;
    storageVisible: boolean;
    localMachineData: ILocalMachine;
    serverDeviceData: IServerDevice;
    databaseData: IDatabase;
    storageData: IStorage;
    localMachineInfo: ILocalMachineInfo;
    RightOperation: IRightOperation;
    orgData: any[];
    // org: any[];
    checkedKeys: string;
    rightOperationData: any[];
    siteId: string;
    serverInfo: any[];
    currentInfo: any[];
    editType: number;
    logData: string;
    institutions: string;
    homeDirectory: string;
    DatabaseKey: number;
    deviceId: number;
    Type: number;
    FuctionId: string;
}
class SiteManage extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            basicVisible: false,
            confirmLoading: false,
            serverVisible: false,
            logVisible: false,
            databaseVisible: false,
            storageVisible: false,
            localMachineData: {
                system_id: 0,
                site_id: 7,
                site_name: '',
                description: ''
            },
            serverDeviceData: {
                system_id: 0,
                site_id: 1,
                type: 1,
                ip_address: '172.16.13.105',
                alias: '',
                guid: '',
                port: 2600,
                websocket_port: 2604,
                log_level: 0,
                function_monitor: 1,
                state: 1,
                log_path: ''
            },
            databaseData: {
                system_id: 0,
                site_id: 1,
                type: 1,
                ip_address: '',
                port: 1,
                database_name: '',
                account: '',
                password: '',
                alias: '',
                state: 1,
                character_set: 'utf8',
                database_key: ''
            },
            storageData: {
                system_id: 0,
                site_id: 1,
                type: 1,
                home_directory: '',
                alias: '',
                available_check: 1,
                guid: '',
                account: '',
                password: '',
                pattern: '',
                state: 1,
                server_ip: '',
                port: 1
            },
            localMachineInfo: {
                params: {
                    system_id: 270
                }
            },
            RightOperation: {
                params: {
                    parent_id: '1022610110901000000',
                    resource_id: '104'
                }
            },
            orgData: [], // 顶级结构数据
            // org: [],
            checkedKeys: '',
            rightOperationData: [], // 右侧数据
            siteId: '', // 站点id
            serverInfo: [], // 站点下的服务器列表
            currentInfo: [], // 当前配置信息
            editType: 1, // 判断是否是编辑
            logData: '', // 日志组件返回过来的路径
            institutions: '',
            homeDirectory: '',
            DatabaseKey: 1,
            deviceId: 1,
            Type: undefined,
            FuctionId: ''
        }
    }

    // 获取站点信息
    public componentDidMount(): void {
        this.getOrg()
    }

    // 添加获取右侧菜单
    public getRightOperation = async (): Promise<void> => {
        const res: any = await _getrightOperation(this.state.RightOperation)
        const data = res.data[0]
        if (this.state.checkedKeys === '104') {
            const rightOperation = data.P004.slice(0, 1)
            this.setState({
                rightOperationData: rightOperation
            })
        } else if (this.state.checkedKeys === '110') {
            const rightOperation = data.P004.slice(1, 2)
            this.setState({
                rightOperationData: rightOperation
            })
        } else if (this.state.checkedKeys === '111') {
            const rightOperation = data.P004.slice(2, 3)
            this.setState({
                rightOperationData: rightOperation
            })
        } else if (this.state.checkedKeys === '112') {
            const rightOperation = data.P004.slice(3, 4)
            this.setState({
                rightOperationData: rightOperation
            })
        }
    }

    // 编辑，删除等操作获取右侧菜单
    public getRightOperation1 = async (): Promise<void> => {
        const rightdata = {
            params: {
                parent_id: '1022610110901000000',
                resource_id: this.state.checkedKeys
            }
        }
        const res: any = await _getrightOperation(rightdata)
        if (res && res.result && res.data.length > 0) {
            const data = res.data[0]
            if (this.state.checkedKeys === '270') {
                const rightOperation = data.P004
                this.setState({
                    rightOperationData: rightOperation
                })
            } else if (this.state.checkedKeys === '289') {
                const rightOperation = data.P004
                this.setState({
                    rightOperationData: rightOperation
                })
            } else if (this.state.checkedKeys === '288') {
                const rightOperation = data.P004
                this.setState({
                    rightOperationData: rightOperation
                })
            } else if (this.state.checkedKeys === '287') {
                const rightOperation = data.P004
                this.setState({
                    rightOperationData: rightOperation
                })
            }
        }
    }

    public rightIdData = (data): void => {
        this.setState({
            FuctionId: data.P005
        }, (): void => {
            console.log(this.state.FuctionId)
        })
        if (data.P003 === 'OP10226101109010101') {
            this.setState({
                basicVisible: true,
                editType: 1
            })
        } else if (data.P003 === 'OP10226101109010301') {
            this.setState({
                serverVisible: true,
                editType: 1
            })
        } else if (data.P003 === 'OP10226101109010501') {
            this.setState({
                storageVisible: true,
                editType: 1
            })
        } else if (data.P003 === 'OP10226101109010701') {
            this.setState({
                databaseVisible: true,
                editType: 1
            })
        } else if (data.P003 === 'OP10226101109010102') {
            this.deleteRecordConfig()
        } else if (data.P003 === 'OP10226101109010302') {
            this.deleteRecordConfig()
        } else if (data.P003 === 'OP10226101109010502') {
            this.deleteRecordConfig()
        } else if (data.P003 === 'OP10226101109010702') {
            this.deleteRecordConfig()
        } else if (data.P003 === 'OP10226101109010103') {
            this.setState({
                basicVisible: true,
                editType: 2
            })
        } else if (data.P003 === 'OP10226101109010303') {
            this.setState({
                serverVisible: true,
                editType: 2
            })
        } else if (data.P003 === 'OP10226101109010304') {
            this.setState({
                logVisible: true,
                editType: 2
            })
        } else if (data.P003 === 'OP10226101109010703') {
            this.setState({
                databaseVisible: true,
                editType: 2
            })
        } else if (data.P003 === 'OP10226101109010503') {
            this.setState({
                storageVisible: true,
                editType: 2
            })
        } else if (data.P003 === 'OP10226101109010105') {
            this.enableLocalMachine()
        } else if (data.P003 === 'OP10226101109010305') {
            this.enableServerDevice()
        } else if (data.P003 === 'OP10226101109010505') {
            this.enableStorage()
        } else if (data.P003 === 'OP10226101109010705') {
            this.enableDataBase()
        }
    }

    public onExpand = (keys: any, event: any): void => {
        console.log('Trigger Select', keys, event)
        this.setState({
            siteId: event.node.props.siteId
        })
    }

    public onSelect = (keys: any, event: any): void => {
        console.log('Trigger Select', keys, event)
        const key = keys[0].substring(0, 3)
        this.setState({
            checkedKeys: key
        })
        if (key === '104') {
            this.getRightOperation()
        } else if (key === '270') {
            console.log('这是站点')
            this.setState({
                siteId: event.node.props.siteId
            }, (): void => {
                console.log(this.state.siteId)
                this.getCurrentRecordConfig()
                this.getRightOperation1()
            })
        } else if (key === '110') {
            console.log('这是服务器设备')
            this.getRightOperation()
            this.setState({
                siteId: event.node.props.siteId
            })
        } else if (key === '111') {
            console.log('这是存储设备')
            this.getRightOperation()
            this.setState({
                siteId: event.node.props.siteId
            }, (): void => {
                this.getRecordConfig()
            })
        } else if (key === '112') {
            console.log('这是数据库设备')
            this.getRightOperation()
            this.setState({
                siteId: event.node.props.siteId
            })
        } else if (key === '289') {
            this.setState({
                siteId: event.node.props.siteId
            }, (): void => {
                this.getCurrentRecordConfig()
                this.getRightOperation1()
            })
        } else if (key === '288') {
            this.setState({
                siteId: event.node.props.siteId,
                deviceId: event.node.props.deviceId,
                Type: event.node.props.Type
            }, (): void => {
                this.getCurrentRecordConfig1()
                this.getRightOperation1()
            })
        } else if (key === '287') {
            this.setState({
                siteId: event.node.props.siteId,
                DatabaseKey: event.node.props.DatabaseKey
            }, (): void => {
                this.getCurrentRecordConfig()
                this.getRightOperation1()
            })
        }
    };

    // 获取顶级机构
    public getOrg = async (): Promise<void> => {
        const res: any = await _getOrg()
        if (res && res.result) {
            const treedata = []
            const org = res.data[0].system_id
            res.data.forEach((item: any): void => {
                treedata.push({ title: item.full_name, key: `${item.system_id}${Math.floor(Math.random() * 10000000)}` })
            })
            this.setState({
                orgData: treedata,
                institutions: org
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
                        console.log(localMachine)
                        const treedata = []
                        localMachine.forEach((item: any): void => {
                            treedata.push({ title: item.full_name, key: `${item.system_id}${Math.floor(Math.random() * 10000000)}`, siteId: item.siteid })
                        })
                        const data = JSON.parse(JSON.stringify(this.state.orgData))
                        data[0].children = treedata
                        for (const item of data[0].children) {
                            item.children = [
                                { key: `110${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011090100MT002').d('服务器设备')}`, siteId: item.siteId },
                                { key: `111${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011090100MT003').d('存储设备')}`, siteId: item.siteId },
                                { key: `112${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011090100MT004').d('数据库')}`, siteId: item.siteId }
                            ]
                        }
                        treeNode.props.dataRef.children = data[0].children
                        this.setState((prevState: any): any => ({
                            orgData: [...prevState.orgData]
                        }))
                    }
                    resolve()
                })
            }
            if (this.state.siteId !== undefined && treeNode.props.eventKey.substring(0, 3) === '110') {
                const data = {
                    params: {
                        system_id: 289,
                        site_id: this.state.siteId
                    }
                }
                if (treeNode.props.children) {
                    resolve()
                    return
                }
                _getRecordConfig(data).then((res: any): void => {
                    if (res && res.result && res.data !== 'null') {
                        const newData = res.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
                        const serverData = JSON.parse(newData)
                        console.log(serverData)
                        const orgdata = JSON.parse(JSON.stringify(this.state.orgData))
                        const treedata = []
                        serverData.forEach((item: any): void => {
                            treedata.push({ title: item.full_name, key: `${item.system_id}${Math.floor(Math.random() * 10000000)}`, siteId: item.siteid, isLeaf: true, guid: item.guid })
                        })
                        for (const item of orgdata[0].children) {
                            for (const item1 of treedata) {
                                if (item1.siteId === item.siteId) {
                                    if (item.children[0].children) {
                                        item.children[0].children = treedata
                                    } else {
                                        item.children[0].children = treedata
                                    }
                                }
                            }
                        }
                        this.setState((): any => ({
                            orgData: orgdata
                        }))
                    }
                    resolve()
                })
            }
            if (this.state.siteId !== undefined && treeNode.props.eventKey.substring(0, 3) === '111') {
                const data = {
                    params: {
                        system_id: 288,
                        site_id: this.state.siteId
                    }
                }
                if (treeNode.props.children) {
                    resolve()
                    return
                }
                _getRecordConfig(data).then((res: any): void => {
                    if (res && res.result && res.data !== 'null') {
                        const DBBridgeData = JSON.parse(res.data)
                        console.log(DBBridgeData)
                        const orgdata = JSON.parse(JSON.stringify(this.state.orgData))
                        const treedata = []
                        DBBridgeData.forEach((item: any): void => {
                            treedata.push({ title: item.Full_Name, key: `${item.SystemId}${Math.floor(Math.random() * 10000000)}`, deviceId: item.DeviceId, siteId: item.SiteId, Type: item.Type, isLeaf: true })
                        })
                        for (const item of orgdata[0].children) {
                            for (const item1 of treedata) {
                                if (item1.siteId === item.siteId) {
                                    if (item.children[1].children) {
                                        item.children[1].children = treedata
                                    } else {
                                        item.children[1].children = treedata
                                    }
                                }
                            }
                        }
                        this.setState((): any => ({
                            orgData: orgdata
                        }))
                    }
                    resolve()
                })
            }
            if (this.state.siteId !== undefined && treeNode.props.eventKey.substring(0, 3) === '112') {
                const data = {
                    params: {
                        system_id: 287,
                        site_id: this.state.siteId
                    }
                }
                if (treeNode.props.children) {
                    resolve()
                    return
                }
                _getRecordConfig(data).then((res: any): void => {
                    if (res && res.result && res.data !== 'null') {
                        const dataBaseData = JSON.parse(res.data)
                        const orgdata = JSON.parse(JSON.stringify(this.state.orgData))
                        const treedata = []
                        dataBaseData.forEach((item: any): void => {
                            treedata.push({ title: item.Full_Name, key: `${item.SystemId}${Math.floor(Math.random() * 10000000)}`, DatabaseKey: item.DatabaseKey, siteId: item.SiteId, isLeaf: true })
                        })
                        for (const item of orgdata[0].children) {
                            for (const item1 of treedata) {
                                if (item1.siteId === item.siteId) {
                                    if (item.children[2].children) {
                                        item.children[2].children = treedata
                                    } else {
                                        item.children[2].children = treedata
                                    }
                                }
                            }
                        }
                        this.setState((): any => ({
                            orgData: orgdata
                        }))
                    }
                    resolve()
                })
            }
        })
    )

    // 获取站点下的所有服务器作为传给存储设备所在服务器的数据
    public getRecordConfig = async (): Promise<void> => {
        const data = {
            params: {
                system_id: 289,
                site_id: this.state.siteId
            }
        }
        const res: any = await _getRecordConfig(data)
        if (res && res.result) {
            const newData = res.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
            const serverData = JSON.parse(newData)
            this.setState({
                serverInfo: serverData
            })
        }
    }

    // 获取当前录音配置信息
    public getCurrentRecordConfig = async (): Promise<void> => {
        const data = {
            params: {
                system_id: Number(this.state.checkedKeys),
                site_id: this.state.siteId
            }
        }
        const res: any = await _getRecordConfig(data)
        if (res && res.result) {
            const newData = res.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
            let currentData1
            const currentData = JSON.parse(newData)
            console.log(currentData)
            if (this.state.checkedKeys === '287') {
                for (const item of currentData) {
                    if (item.DatabaseKey === Number(this.state.DatabaseKey)) {
                        currentData1 = item
                    }
                }
            } else if (this.state.checkedKeys === '288') {
                for (const item of currentData) {
                    if (item.DeviceId === Number(this.state.deviceId)) {
                        currentData1 = item
                    }
                }
            } else if (this.state.checkedKeys === '270') {
                for (const item of currentData) {
                    if (item.siteid === this.state.siteId) {
                        currentData1 = item
                    }
                }
            } else if (this.state.checkedKeys === '289') {
                for (const item of currentData) {
                    if (item.siteid === this.state.siteId) {
                        currentData1 = item
                    }
                }
            }
            this.setState({
                currentInfo: currentData1
            }, (): void => {
                if (this.state.checkedKeys === '270' || this.state.checkedKeys === '288' || this.state.checkedKeys === '287') {
                    this.undateNode(this.state.orgData, this.state.currentInfo)
                }
            })
        }
    }

    public getCurrentRecordConfig1 = async (): Promise<void> => {
        const data = {
            params: {
                system_id: Number(this.state.checkedKeys),
                site_id: this.state.siteId,
                type: this.state.Type
            }
        }
        const res: any = await _getRecordConfig(data)
        if (res && res.result) {
            const newData = res.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
            let currentData1
            const currentData = JSON.parse(newData)
            console.log(currentData)
            if (this.state.checkedKeys === '288') {
                for (const item of currentData) {
                    if (item.DeviceId === Number(this.state.deviceId)) {
                        currentData1 = item
                    }
                }
            }
            this.setState({
                currentInfo: currentData1
            }, (): void => {
                if (this.state.checkedKeys === '288') {
                    this.undateNode(this.state.orgData, this.state.currentInfo)
                }
            })
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

    // 添加站点
    public localMachineData = (data: any): void => {
        const data1 = {
            system_id: 0,
            site_id: data.siteId,
            site_name: data.siteName,
            description: data.description,
            institutions: this.state.institutions,
            state: 1,
            function_id: this.state.FuctionId
        }
        this.setState((): any => ({
            localMachineData: data1
        }))
    }

    public handleLocalMachine = (): void => {
        this.addLocalMachine()
    }

    public addLocalMachine = async (): Promise<void> => {
        const res: any = await _addLocalMachine(this.state.localMachineData)
        if (res && res.result) {
            this.setState({
                basicVisible: false
            })
            const localMachineData = JSON.parse(JSON.stringify(this.state.localMachineData))
            const treedata = {
                title: localMachineData.site_name,
                key: `${270}${Math.floor(Math.random() * 10000000)}`,
                siteId: localMachineData.site_id
            }
            this.insertNode(this.state.orgData, treedata)
        } else {
            message.warning(res.msg)
        }
    }

    // 修改站点
    public modifyLocalMachine = async (): Promise<void> => {
        const data = {
            system_id: 270,
            site_id: this.state.localMachineData.site_id,
            site_name: this.state.localMachineData.site_name,
            description: this.state.localMachineData.description,
            institutions: this.state.institutions,
            state: 1,
            function_id: this.state.FuctionId
        }
        const res: any = await _addLocalMachine(data)
        if (res && res.result) {
            this.setState({
                basicVisible: false
            })
            this.getCurrentRecordConfig()
        } else {
            message.warning(res.msg)
        }
    }

    // 删除
    public deleteRecordConfig = (): void => {
        Modal.confirm({
            title: `${intl.get('M26P102261011090100MT006').d('确定删除吗?')}`,
            content: '',
            okText: `${intl.get('COM00100010001').d('确定')}`,
            cancelText: `${intl.get('COM00100010003').d('取消')}`,
            okType: 'danger',
            onCancel: (): void => { console.log('cancle') },
            onOk: (): void => {
                this.delete()
            }
        })
    }

    public delete = async (): Promise<void> => {
        const currentData = JSON.parse(JSON.stringify(this.state.currentInfo))
        if (this.state.checkedKeys === '287') {
            const data = {
                params: {
                    system_id: Number(this.state.checkedKeys),
                    site_id: Number(this.state.siteId),
                    delete_code: currentData.DatabaseKey,
                    key: '',
                    function_id: this.state.FuctionId
                }
            }
            const res: any = await _deleteConfig(data)
            if (res && res.result) {
                // this.setState({
                //     currentInfo: null
                // })
                this.deleteNode(this.state.orgData)
            } else {
                // message.warning(res.msg)
            }
        } else if (this.state.checkedKeys === '289') {
            const data = {
                params: {
                    system_id: Number(this.state.checkedKeys),
                    site_id: Number(this.state.siteId),
                    delete_code: currentData.deviceId,
                    key: currentData.guid,
                    function_id: this.state.FuctionId
                }
            }
            const res: any = await _deleteConfig(data)
            if (res && res.result) {
                // this.setState({
                //     currentInfo: null
                // })
                this.deleteNode(this.state.orgData)
            } else {
                message.warning(res.msg)
            }
        } else {
            const data = {
                params: {
                    system_id: Number(this.state.checkedKeys),
                    site_id: Number(this.state.siteId),
                    delete_code: currentData.DeviceId,
                    key: '',
                    function_id: this.state.FuctionId
                }
            }
            const res: any = await _deleteConfig(data)
            if (res && res.result) {
                // this.setState({
                //     currentInfo: null
                // })
                this.deleteNode(this.state.orgData)
            } else {
                // message.warning(res.msg)
            }
        }
    }

    // 添加服务器
    public serverDeviceData = (data: any): void => {
        const data1 = {
            system_id: 0,
            site_id: this.state.siteId,
            guid: data.guid,
            port: data.port,
            websocket_port: data.websocketPort,
            type: Number(data.type),
            ip_address: data.IP_address,
            alias: data.alias,
            log_level: Number(data.logLevel),
            function_monitor: data.functionMonitor === true ? 1 : 0,
            state: 1,
            log_path: this.state.logData,
            function_id: this.state.FuctionId
        }
        this.setState((): any => ({
            serverDeviceData: data1
        }))
    }

    public handleServerDevice = (): void => {
        this.addServerDevice()
    }

    // 添加的时候调用一次设置路径
    public addSetLogDirectory = async (): Promise<void> => {
        const data = {
            server_ip: this.state.serverDeviceData.ip_address,
            server_port: this.state.serverDeviceData.port.toString(),
            directory: this.state.logData
        }
        const res2: any = await _setLogDirectory(data)
        if (res2 && res2.result) {
            console.log(res2)
        }
    }

    public addServerDevice = async (): Promise<void> => {
        const params = {
            params: {
                server_ip: this.state.serverDeviceData.ip_address,
                server_port: this.state.serverDeviceData.port.toString()
            }

        }
        const res1: any = await _getDriver(params)
        if (res1 && res1.result) {
            if (res1.data.os_type === 'UNIX') {
                this.setState({
                    logData: '/opt/houmong/iRecord/logs'
                }, (): void => {
                    console.log(this.state.logData)
                    this.addSetLogDirectory()
                })
            } else {
                this.setState({
                    logData: 'C:\\'
                }, (): void => {
                    this.addSetLogDirectory()
                })
            }
        }
        const serverDeviceData = JSON.parse(JSON.stringify(this.state.serverDeviceData))
        serverDeviceData.log_path = this.state.logData
        const res: any = await _addServerDevice(serverDeviceData)
        if (res && res.result) {
            this.setState({
                serverVisible: false
            })
            const treedata = {
                title: serverDeviceData.ip_address,
                key: `${289}${Math.floor(Math.random() * 10000000)}`,
                siteId: serverDeviceData.site_id,
                guid: res.data,
                tit: `${intl.get('M26P102261011090100MT002').d('服务器设备')}`,
                isLeaf: true
            }
            this.insertNode(this.state.orgData, treedata)
        }
    }


    // 设置Restful websocket端口,修改服务器时需调用
    public setRestfulPort = async (): Promise<void> => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        const data = {
            server_ip: this.state.serverDeviceData.ip_address.toString(),
            server_port: `${this.state.serverDeviceData.port}|${this.state.serverDeviceData.websocket_port}`,
            old_server_port: currentInfo.oldport
        }
        const res: any = await _setServerPort(data)
        if (res && res.result) {
            console.log(res)
        }
    }

    // 设置日志存放目录,修改服务器时需调用
    public setLogDirectory = async (): Promise<void> => {
        const data = {
            server_ip: this.state.serverDeviceData.ip_address.toString(),
            server_port: this.state.serverDeviceData.port.toString(),
            directory: this.state.logData
        }
        const res: any = await _setLogDirectory(data)
        if (res && res.result) {
            console.log(res)
        }
    }

    // 设置日志记录的等级,修改服务器时需调用
    public setLogGrade = async (): Promise<void> => {
        const data = {
            server_ip: this.state.serverDeviceData.ip_address.toString(),
            server_port: this.state.serverDeviceData.port.toString(),
            grade: this.state.serverDeviceData.log_level.toString()
        }
        const res: any = await _setLogGrade(data)
        if (res && res.result) {
            console.log(res)
        }
    }

    // 设置Restful websocket端口,修改服务器时需调用
    public setRestfulPort1 = async (): Promise<void> => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        const data = {
            server_ip: currentInfo.ipaddress,
            server_port: `${currentInfo.port}|${currentInfo.websocketport}`,
            old_server_port: currentInfo.oldport
        }
        const res: any = await _setServerPort(data)
        if (res && res.result) {
            console.log(res)
        }
    }

    // 设置日志存放目录,修改服务器时需调用
    public setLogDirectory1 = async (): Promise<void> => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        const data = {
            server_ip: currentInfo.ipaddress,
            server_port: currentInfo.port,
            directory: this.state.logData
        }
        const res: any = await _setLogDirectory(data)
        if (res && res.result) {
            console.log(res)
        }
    }

    // 设置日志记录的等级,修改服务器时需调用
    public setLogGrade1 = async (): Promise<void> => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        const data = {
            server_ip: currentInfo.ipaddress,
            server_port: currentInfo.port.toString(),
            grade: currentInfo.loglevel.toString()
        }
        const res: any = await _setLogGrade(data)
        if (res && res.result) {
            console.log(res)
        }
    }

    // 修改服务器
    public modifyServer = async (): Promise<void> => {
        this.setRestfulPort()
        this.setLogDirectory()
        this.setLogGrade()
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        const data = {
            system_id: 289,
            site_id: Number(this.state.siteId),
            guid: this.state.serverDeviceData.guid,
            port: this.state.serverDeviceData.port,
            websocket_port: this.state.serverDeviceData.websocket_port,
            type: Number(this.state.serverDeviceData.type),
            ip_address: this.state.serverDeviceData.ip_address.toString(),
            alias: this.state.serverDeviceData.alias.toString(),
            log_level: Number(this.state.serverDeviceData.log_level),
            function_monitor: this.state.serverDeviceData.function_monitor,
            state: 1,
            device_id: currentInfo.deviceid,
            log_path: currentInfo.logpath,
            function_id: this.state.FuctionId
        }
        const res: any = await _addServerDevice(data)
        if (res && res.result) {
            this.setState({
                serverVisible: false
            })
            this.getCurrentRecordConfig()
        }
    }

    public logData = (data): void => {
        this.setState({
            logData: data
        })
    }

    // 添加日志路径
    public addLog = async (): Promise<void> => {
        this.setRestfulPort1()
        this.setLogDirectory1()
        this.setLogGrade1()
        console.log(this.state.logData)
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        const data = {
            system_id: 289,
            site_id: currentInfo.siteid,
            guid: currentInfo.guid,
            port: currentInfo.port,
            websocket_port: currentInfo.websocketport,
            type: currentInfo.type,
            ip_address: currentInfo.ipaddress,
            alias: currentInfo.alias,
            log_level: currentInfo.loglevel,
            function_monitor: currentInfo.functionmonitor,
            state: 1,
            device_id: currentInfo.deviceid,
            log_path: this.state.logData,
            function_id: this.state.FuctionId
        }
        const res: any = await _addServerDevice(data)
        if (res && res.result) {
            this.setState({
                logVisible: false
            })
            this.getCurrentRecordConfig()
        }
    }

    // 添加数据库
    public databaseData = (data: any): void => {
        const data1 = {
            system_id: 0,
            site_id: this.state.siteId,
            type: Number(data.type),
            ip_address: data.IPAddress,
            port: data.port,
            database_name: data.databaseName,
            account: data.account,
            password: data.password,
            alias: data.alias,
            state: 1,
            character_set: 'utf8',
            function_id: this.state.FuctionId
        }
        this.setState((): any => ({
            databaseData: data1
        }))
    }

    public handleDatabase = (): void => {
        this.addDatabase()
    }

    public addDatabase = async (): Promise<void> => {
        const res: any = await _addDatabase(this.state.databaseData)
        if (res && res.result) {
            this.setState({
                databaseVisible: false,
                DatabaseKey: res.data
            })
            const databaseData = JSON.parse(JSON.stringify(this.state.databaseData))
            const treedata = {
                title: databaseData.database_name,
                key: `${287}${Math.floor(Math.random() * 10000000)}`,
                siteId: databaseData.site_id,
                DatabaseKey: res.data,
                tit: `${intl.get('M26P102261011090100MT004').d('数据库')}`,
                isLeaf: true
            }
            this.insertNode(this.state.orgData, treedata)
        }
    }

    // 修改数据库
    public modifyDatabase = async (): Promise<void> => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        const data = {
            system_id: 287,
            site_id: Number(this.state.databaseData.site_id),
            database_name: this.state.databaseData.database_name,
            type: Number(this.state.databaseData.type),
            ip_address: this.state.databaseData.ip_address,
            port: Number(this.state.databaseData.port),
            account: this.state.databaseData.account,
            password: this.state.databaseData.password,
            alias: this.state.databaseData.alias,
            state: 1,
            character_set: 'utf8',
            database_key: currentInfo.DatabaseKey,
            function_id: this.state.FuctionId
        }
        const res: any = await _addDatabase(data)
        if (res && res.result) {
            this.setState({
                databaseVisible: false
            })
            this.getCurrentRecordConfig()
        }
    }

    public homeDirectoryData = (data: any): void => {
        this.setState({
            homeDirectory: data
        })
    }

    // 添加存储设备
    public storageData = (data: any): void => {
        const data1 = {
            system_id: 0,
            site_id: this.state.siteId,
            type: Number(data.type),
            alias: data.alias,
            available_check: data.availableCheck === true ? 1 : 0,
            guid: data.guid,
            account: data.account,
            password: data.password,
            pattern: data.pattern,
            server_ip: data.serverIp,
            port: data.port,
            state: 1,
            function_id: this.state.FuctionId
        }
        this.setState((): any => ({
            storageData: data1
        }))
    }

    public handleStorage = (): void => {
        this.addStorage()
    }

    public addStorage = async (): Promise<void> => {
        const data = JSON.parse(JSON.stringify(this.state.storageData))
        data.home_directory = this.state.homeDirectory
        const res: any = await _addStorage(data)
        if (res && res.result) {
            this.setState({
                storageVisible: false,
                deviceId: res.data
            })
            const storageData = JSON.parse(JSON.stringify(this.state.storageData))
            const treedata = {
                title: storageData.alias,
                key: `${288}${Math.floor(Math.random() * 10000000)}`,
                siteId: storageData.site_id,
                deviceId: res.data,
                tit: `${intl.get('M26P102261011090100MT003').d('存储设备')}`,
                isLeaf: true
            }
            this.insertNode(this.state.orgData, treedata)
        }
    }

    // 修改存储设备
    public modifyStorage = async (): Promise<void> => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        const data = {
            system_id: 288,
            site_id: Number(this.state.siteId),
            type: Number(this.state.storageData.type),
            home_directory: this.state.homeDirectory,
            alias: this.state.storageData.alias,
            available_check: this.state.storageData.available_check,
            guid: this.state.storageData.guid,
            account: this.state.storageData.account,
            password: this.state.storageData.password,
            pattern: this.state.storageData.pattern,
            server_ip: this.state.storageData.server_ip,
            port: this.state.storageData.port,
            state: 1,
            device_id: currentInfo.DeviceId,
            function_id: this.state.FuctionId
        }
        const res: any = await _addStorage(data)
        if (res && res.result) {
            this.setState({
                storageVisible: false
            })
            this.getCurrentRecordConfig()
        }
    }

    // 启禁用站点
    public enableLocalMachine = async (): Promise<void> => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        if (currentInfo.state === 1) {
            const data = {
                system_id: 270,
                site_id: currentInfo.siteid,
                site_name: currentInfo.sitename,
                description: currentInfo.description,
                state: 0,
                institutions: this.state.institutions,
                function_id: this.state.FuctionId
            }
            const res: any = await _addLocalMachine(data)
            if (res && res.result) {
                message.success(`${intl.get('COM00100010008').d('操作成功')}`)
                this.getCurrentRecordConfig()
            }
        } else if (currentInfo.state === 0) {
            const data = {
                system_id: 270,
                site_id: currentInfo.siteid,
                site_name: currentInfo.sitename,
                description: currentInfo.description,
                institutions: this.state.institutions,
                state: 1,
                function_id: this.state.FuctionId
            }
            const res: any = await _addLocalMachine(data)
            if (res && res.result) {
                message.success(`${intl.get('COM00100010008').d('操作成功')}`)
                this.getCurrentRecordConfig()
            }
        }
    }

    // 启禁用服务器
    public enableServerDevice = async (): Promise<void> => {
        this.setRestfulPort()
        this.setLogDirectory()
        this.setLogGrade()
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        if (currentInfo.state === 1) {
            const data = {
                system_id: 289,
                site_id: currentInfo.siteid,
                guid: currentInfo.guid,
                port: currentInfo.port,
                websocket_port: currentInfo.websocketport,
                type: currentInfo.type,
                ip_address: currentInfo.ipaddress,
                alias: currentInfo.alias,
                log_level: currentInfo.loglevel,
                function_monitor: currentInfo.functionmonitor,
                state: 0,
                device_id: currentInfo.deviceid,
                log_path: currentInfo.logpath,
                function_id: this.state.FuctionId
            }
            const res: any = await _addServerDevice(data)
            if (res && res.result) {
                message.success(`${intl.get('COM00100010008').d('操作成功')}`)
                this.getCurrentRecordConfig()
            }
        } else if (currentInfo.state === 0) {
            const data = {
                system_id: 289,
                site_id: currentInfo.siteid,
                guid: currentInfo.guid,
                port: currentInfo.port,
                websocket_port: currentInfo.websocketport,
                type: currentInfo.type,
                ip_address: currentInfo.ipaddress,
                alias: currentInfo.alias,
                log_level: currentInfo.loglevel,
                function_monitor: currentInfo.functionmonitor,
                state: 1,
                device_id: currentInfo.deviceid,
                log_path: currentInfo.logpath,
                function_id: this.state.FuctionId
            }
            const res: any = await _addServerDevice(data)
            if (res && res.result) {
                message.success(`${intl.get('COM00100010008').d('操作成功')}`)
                this.getCurrentRecordConfig()
            }
        }
    }

    // 启禁用数据库
    public enableDataBase = async (): Promise<void> => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        if (currentInfo.State === 1) {
            const data = {
                system_id: 287,
                site_id: Number(currentInfo.SiteId),
                database_name: currentInfo.DatabaseName,
                type: Number(currentInfo.Type),
                ip_address: currentInfo.IpAddress,
                port: Number(currentInfo.Port),
                account: currentInfo.Account,
                password: currentInfo.Password,
                alias: currentInfo.Alias,
                state: 0,
                character_set: currentInfo.CharacterSet,
                database_key: currentInfo.DatabaseKey,
                function_id: this.state.FuctionId
            }
            const res: any = await _addDatabase(data)
            if (res && res.result) {
                message.success(`${intl.get('COM00100010008').d('操作成功')}`)
                this.getCurrentRecordConfig()
            }
        } else if (currentInfo.State === 0) {
            const data = {
                system_id: 287,
                site_id: Number(currentInfo.SiteId),
                database_name: currentInfo.DatabaseName,
                type: Number(currentInfo.Type),
                ip_address: currentInfo.IpAddress,
                port: Number(currentInfo.Port),
                account: currentInfo.Account,
                password: currentInfo.Password,
                alias: currentInfo.Alias,
                state: 1,
                character_set: currentInfo.CharacterSet,
                database_key: currentInfo.DatabaseKey,
                function_id: this.state.FuctionId
            }
            const res: any = await _addDatabase(data)
            if (res && res.result) {
                message.success(`${intl.get('COM00100010008').d('操作成功')}`)
                this.getCurrentRecordConfig()
            }
        }
    }

    // 启禁用存储设备
    public enableStorage = async (): Promise<void> => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        if (currentInfo.State === 1) {
            const data = {
                system_id: 288,
                site_id: currentInfo.SiteId,
                type: currentInfo.Type,
                home_directory: currentInfo.HomeDirectory,
                alias: currentInfo.Alias,
                available_check: currentInfo.AvailableCheck,
                guid: currentInfo.Guid,
                account: currentInfo.Account,
                password: currentInfo.Password,
                pattern: currentInfo.Pattern,
                server_ip: currentInfo.ServerIp,
                port: currentInfo.Port,
                state: 0,
                device_id: currentInfo.DeviceId,
                function_id: this.state.FuctionId
            }
            const res: any = await _addStorage(data)
            if (res && res.result) {
                message.success(`${intl.get('COM00100010008').d('操作成功')}`)
                this.getCurrentRecordConfig()
            }
        } else if (currentInfo.State === 0) {
            const data = {
                system_id: 288,
                site_id: currentInfo.SiteId,
                type: currentInfo.Type,
                home_directory: currentInfo.HomeDirectory,
                alias: currentInfo.Alias,
                available_check: currentInfo.AvailableCheck,
                guid: currentInfo.Guid,
                account: currentInfo.Account,
                password: currentInfo.Password,
                pattern: currentInfo.Pattern,
                server_ip: currentInfo.ServerIp,
                port: currentInfo.Port,
                state: 1,
                device_id: currentInfo.DeviceId,
                function_id: this.state.FuctionId
            }
            const res: any = await _addStorage(data)
            if (res && res.result) {
                message.success(`${intl.get('COM00100010008').d('操作成功')}`)
                this.getCurrentRecordConfig()
            }
        }
    }

    // 新增节点
    public insertNode = (tData, newdata): void => {
        if (newdata !== undefined && this.state.checkedKeys === '104') {
            newdata.children = [
                { key: `110${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011090100MT002').d('服务器设备')}`, siteId: newdata.siteId },
                { key: `111${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011090100MT003').d('存储设备')}`, siteId: newdata.siteId },
                { key: `112${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011090100MT004').d('数据库')}`, siteId: newdata.siteId }
            ]
            for (const data of tData) {
                if (data.siteId === this.state.siteId) {
                    if (data.children) {
                        data.children.push(newdata)
                    } else {
                        data.children = [newdata]
                    }
                    this.setState((prevState: any): any => ({
                        orgData: [...prevState.orgData]
                    }))
                } else if (data.children && data.children.length > 0) {
                    this.insertNode(data.children, newdata)
                }
            }
        }
        if (newdata !== undefined && this.state.checkedKeys === '110') {
            for (const data of tData) {
                if (data.title === newdata.tit && data.siteId === newdata.siteId) {
                    if (data.children) {
                        data.children.push(newdata)
                    } else {
                        data.children = [newdata]
                    }
                    this.setState((prevState: any): any => ({
                        orgData: [...prevState.orgData]
                    }))
                } else if (data.children && data.children.length > 0) {
                    this.insertNode(data.children, newdata)
                }
            }
        }
        if (newdata !== undefined && this.state.checkedKeys === '111') {
            for (const data of tData) {
                if (data.title === newdata.tit && data.siteId === newdata.siteId) {
                    if (data.children) {
                        data.children.push(newdata)
                    } else {
                        data.children = [newdata]
                    }
                    this.setState((prevState: any): any => ({
                        orgData: [...prevState.orgData]
                    }))
                } else if (data.children && data.children.length > 0) {
                    this.insertNode(data.children, newdata)
                }
            }
        }
        if (newdata !== undefined && this.state.checkedKeys === '112') {
            for (const data of tData) {
                if (data.title === newdata.tit && data.siteId === newdata.siteId) {
                    if (data.children) {
                        data.children.push(newdata)
                    } else {
                        data.children = [newdata]
                    }
                    this.setState((prevState: any): any => ({
                        orgData: [...prevState.orgData]
                    }))
                } else if (data.children && data.children.length > 0) {
                    this.insertNode(data.children, newdata)
                }
            }
        }
    }

    // 更新节点
    public undateNode = (tData, data): any => {
        console.log(tData)
        console.log(data)
        if (this.state.checkedKeys === '270') {
            for (const item of tData) {
                if (item.siteId === data.siteid) {
                    item.title = data.full_name
                    this.setState((prevState: any): any => ({
                        orgData: [...prevState.orgData]
                    }))
                } else if (item.children && item.children.length > 0) {
                    this.undateNode(item.children, data)
                }
            }
        }
        if (this.state.checkedKeys === '287') {
            for (const item of tData) {
                if (Number(item.DatabaseKey) === data.DatabaseKey) {
                    item.title = data.Full_Name
                    this.setState((prevState: any): any => ({
                        orgData: [...prevState.orgData]
                    }))
                } else if (item.children && item.children.length > 0) {
                    this.undateNode(item.children, data)
                }
            }
        }
        if (this.state.checkedKeys === '288' && data !== undefined) {
            for (const item of tData) {
                if (Number(item.DeviceId) === data.deviceid) {
                    item.title = data.full_name
                    this.setState((prevState: any): any => ({
                        orgData: [...prevState.orgData]
                    }))
                } else if (item.children && item.children.length > 0) {
                    this.undateNode(item.children, data)
                }
            }
        }
    }

    // 删除节点
    public deleteNode = (tData): void => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        // 删除数据库节点
        if (this.state.checkedKeys === '287') {
            for (let i = 0; i < tData.length; i++) {
                if (tData[i].siteId === currentInfo.siteId && Number(tData[i].DatabaseKey) === currentInfo.DatabaseKey) {
                    tData.splice(i, 1)
                    this.setState((prevState: any): any => ({
                        orgData: [...prevState.orgData],
                        currentInfo: []
                    }))
                } else if (tData[i].children && tData[i].children.length > 0) {
                    this.deleteNode(tData[i].children)
                }
            }
        }
        // 删除服务器节点
        if (this.state.checkedKeys === '289') {
            for (let i = 0; i < tData.length; i++) {
                if (tData[i].siteId === currentInfo.siteid && tData[i].guid === currentInfo.guid) {
                    tData.splice(i, 1)
                    this.setState((prevState: any): any => ({
                        orgData: [...prevState.orgData],
                        currentInfo: []
                    }))
                } else if (tData[i].children && tData[i].children.length > 0) {
                    this.deleteNode(tData[i].children)
                }
            }
        }
        // 删除存储设备节点
        if (this.state.checkedKeys === '288') {
            for (let i = 0; i < tData.length; i++) {
                if (tData[i].siteId === currentInfo.SiteId && Number(tData[i].deviceId) === currentInfo.DeviceId) {
                    tData.splice(i, 1)
                    this.setState((prevState: any): any => ({
                        orgData: [...prevState.orgData],
                        currentInfo: []
                    }))
                } else if (tData[i].children && tData[i].children.length > 0) {
                    this.deleteNode(tData[i].children)
                }
            }
        }
        // 删除站点
        if (this.state.checkedKeys === '270') {
            for (let i = 0; i < tData.length; i++) {
                if (tData[i].siteId === currentInfo.siteid) {
                    tData.splice(i, 1)
                    this.setState((prevState: any): any => ({
                        orgData: [...prevState.orgData],
                        currentInfo: []
                    }))
                } else if (tData[i].children && tData[i].children.length > 0) {
                    this.deleteNode(tData[i].children)
                }
            }
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
                        {this.state.checkedKeys === '270' && this.state.currentInfo !== null ? <BasicInfo dataInfo={this.state.currentInfo} /> : null}
                        {this.state.checkedKeys === '289' && this.state.currentInfo !== null ? <ServerInfo dataInfo={this.state.currentInfo} /> : null}
                        {this.state.checkedKeys === '288' && this.state.currentInfo !== null ? <StorageInfo serverInfo={this.state.serverInfo} dataInfo={this.state.currentInfo} /> : null}
                        {this.state.checkedKeys === '287' && this.state.currentInfo !== null ? <DatabaseInfo dataInfo={this.state.currentInfo} /> : null}
                    </div>
                </div>
                <RightOperation rightOperationData={this.state.rightOperationData} operateCallBack={(data): void => this.rightIdData(data)} />
                <DraggableModal
                    visible={this.state.basicVisible}
                    title={intl.get('M26P102261011090100MT001').d('站点')}
                    width={600}
                    confirmLoading={this.state.confirmLoading}
                    onOk={(): void => { this.handleLocalMachine() }}
                    onCancel={(): void => { this.setState({ basicVisible: false }) }}
                    footer={
                        <div>
                            <Button style={{ marginLeft: '15px' }} onClick={(): void => { this.setState({ basicVisible: false }) }}>{intl.get('COM00100010003').d('取消')}</Button>
                            {this.state.editType === 2 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.modifyLocalMachine() }}>{intl.get('M26P102261011090100MB002').d('修改')}</Button> :
                                null}
                            {this.state.editType === 1 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.handleLocalMachine() }}>{intl.get('COM00100010001').d('确定')}</Button> :
                                null}
                        </div>
                    }
                >
                    <Basic editType={this.state.editType} dataInfo={this.state.currentInfo} LocalMachine={(data: any): void => this.localMachineData(data)} />
                </DraggableModal>
                <DraggableModal
                    visible={this.state.serverVisible}
                    title={intl.get('M26P102261011090100MT002').d('服务器设备')}
                    width={600}
                    onOk={(): void => { this.handleServerDevice() }}
                    onCancel={(): void => { this.setState({ serverVisible: false }) }}
                    footer={
                        <div>
                            <Button style={{ marginLeft: '15px' }} onClick={(): void => { this.setState({ serverVisible: false }) }}>{intl.get('COM00100010003').d('取消')}</Button>
                            {this.state.editType === 2 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.modifyServer() }}>{intl.get('M26P102261011090100MB002').d('修改')}</Button> :
                                null}
                            {this.state.editType === 1 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.handleServerDevice() }}>{intl.get('COM00100010001').d('确定')}</Button> :
                                null}
                        </div>
                    }
                >
                    <Server editType={this.state.editType} dataInfo={this.state.currentInfo} ServerDevice={(data: any): void => this.serverDeviceData(data)} />
                </DraggableModal>
                <DraggableModal
                    visible={this.state.logVisible}
                    title={intl.get('M26P102261011090100MT005').d('日志路径')}
                    width={600}
                    bodyStyle={{ height: '300px', overflow: 'auto' }}
                    onOk={(): void => { this.addLog() }}
                    onCancel={(): void => { this.setState({ logVisible: false }) }}
                >
                    <Log logRoute={(data): void => { this.logData(data) }} editType={this.state.editType} dataInfo={this.state.currentInfo} ServerDevice={(data: any): void => this.serverDeviceData(data)} />
                </DraggableModal>
                <DraggableModal
                    visible={this.state.databaseVisible}
                    title={intl.get('M26P102261011090100MT004').d('数据库')}
                    width={600}
                    onOk={(): void => { this.handleDatabase() }}
                    onCancel={(): void => { this.setState({ databaseVisible: false }) }}
                    footer={
                        <div>
                            <Button style={{ marginLeft: '15px' }} onClick={(): void => { this.setState({ databaseVisible: false }) }}>{intl.get('COM00100010003').d('取消')}</Button>
                            {this.state.editType === 2 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.modifyDatabase() }}>{intl.get('M26P102261011090100MB002').d('修改')}</Button> :
                                null}
                            {this.state.editType === 1 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.handleDatabase() }}>{intl.get('COM00100010001').d('确定')}</Button> :
                                null}
                        </div>
                    }
                >
                    <Database editType={this.state.editType} dataInfo={this.state.currentInfo} Database={(data: any): void => this.databaseData(data)} />
                </DraggableModal>
                <DraggableModal
                    visible={this.state.storageVisible}
                    title={intl.get('M26P102261011090100MT003').d('存储设备')}
                    width={600}
                    bodyStyle={{ maxHeight: '420px', overflow: 'auto' }}
                    onOk={(): void => { this.handleStorage() }}
                    onCancel={(): void => { this.setState({ storageVisible: false }) }}
                    footer={
                        <div>
                            <Button style={{ marginLeft: '15px' }} onClick={(): void => { this.setState({ storageVisible: false }) }}>{intl.get('COM00100010003').d('取消')}</Button>
                            {this.state.editType === 2 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.modifyStorage() }}>{intl.get('M26P102261011090100MB002').d('修改')}</Button> :
                                null}
                            {this.state.editType === 1 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.handleStorage() }}>{intl.get('COM00100010001').d('确定')}</Button> :
                                null}
                        </div>
                    }
                >
                    <Storage editType={this.state.editType} dataInfo={this.state.currentInfo} serverInfo={this.state.serverInfo} homeDirectory={(data: any): void => this.homeDirectoryData(data)} Storage={(data: any): void => this.storageData(data)} />
                </DraggableModal>
            </div>
        )
    }
}


export default SiteManage