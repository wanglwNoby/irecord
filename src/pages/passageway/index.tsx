import * as React from 'react'
import { Tree, Modal, message, Button } from 'antd'
import intl from 'react-intl-universal'
import RightOperation from '../../components/containers/right-operation/rightOperation'
import { _getOrg, _getLocalMachine, _getRecordConfig, _getrightOperation } from '../../common/api/siteManage'
import { _addChannel, _deleteChannel, _getChannel, _addRecordFile, _addDownload, _getDownload, _deleteDownload, _getRecordFile, _deleteRecordFile, _addDelete, _getDelete } from '../../common/api/channel'
import DraggableModal from '../../components/cores/draggableModal/draggableModal'
import AddChannel from './chaannel'
import ChannelInfo from './chaannel/channelInfo/channelInfo'
import Download from './download'
import DownloadInfo from './download/downloadInfo'
import RecordFileInfo from './recordFile/recordFileInfo'
import RecordFile from './recordFile'
import Delete from './delete'
import DeleteInfo from './delete/deleteInfo'
import styles from './index.module.less'

class Passageway extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            rightOperationData: [],
            orgData: [],
            localMachineInfo: {
                params: {
                    system_id: 270
                }
            },
            siteId: null,
            fullName: null,
            channelVisible: false,
            recordFileVisible: false,
            downloadVisible: false,
            deleteVisible: false,
            editType: null,
            channelData: [],
            channelInfo: [],
            storageData: [],
            downloadData: [],
            downloadInfo: [],
            recordFileInfoData: {}, // 点击归档一行返回过来的数据
            recordFileInfo: [],
            downloadInfoData: {}, // 点击下载一行返回的数据
            deleteData: [],
            deleteInfo: [],
            serverKey: '',
            recordservice: [] // 录音服务信息
        }
    }

    public componentDidMount(): void {
        this.getOrg()
    }

    // 获取右侧通道菜单
    public getRightOperation = async (): Promise<void> => {
        const rightdata = {
            params: {
                parent_id: '1022610110911000000',
                resource_id: '272'
            }
        }
        const res: any = await _getrightOperation(rightdata)
        if (res && res.result) {
            const data = res.data[0]
            if (this.state.checkedKeys === '272') {
                const rightOperation = (data.P004).slice(0, 1)
                this.setState({
                    rightOperationData: rightOperation
                })
            } else if (this.state.checkedKeys === 'und') {
                const rightOperation = (data.P004).slice(1, 3)
                this.setState({
                    rightOperationData: rightOperation
                })
            }
        }
    }

    // 获取右侧归档菜单
    public getRightOperation1 = async (): Promise<void> => {
        const rightdata = {
            params: {
                parent_id: '1022610110911000000',
                resource_id: '932'
            }
        }
        const res: any = await _getrightOperation(rightdata)
        if (res && res.result) {
            const data = res.data[0]
            if (this.state.checkedKeys === '273') {
                const rightOperation = data.P004
                this.setState({
                    rightOperationData: rightOperation
                })
            }
        }
    }

    // 获取右侧回删菜单
    public getRightOperation2 = async (): Promise<void> => {
        const rightdata = {
            params: {
                parent_id: '1022610110911000000',
                resource_id: '933'
            }
        }
        const res: any = await _getrightOperation(rightdata)
        if (res && res.result) {
            const data = res.data[0]
            if (this.state.checkedKeys === '274') {
                const rightOperation = (data.P004).slice(0, 1)
                this.setState({
                    rightOperationData: rightOperation
                })
            }
        }
    }

    // 获取右侧下载菜单
    public getRightOperation3 = async (): Promise<void> => {
        const rightdata = {
            params: {
                parent_id: '1022610110911000000',
                resource_id: '931'
            }
        }
        const res: any = await _getrightOperation(rightdata)
        if (res && res.result) {
            const data = res.data[0]
            if (this.state.checkedKeys === '275') {
                const rightOperation = data.P004
                this.setState({
                    rightOperationData: rightOperation
                })
            }
        }
    }

    public onExpand = (_keys: any, event: any): void => {
        this.setState({
            siteId: event.node.props.siteId
        }, (): void => {
        })
        const key = event.node.props.eventKey.substring(0, 3)
        this.setState({
            checkedKeys: key
        })
        if (key === '272') {
            this.treeparent(this.state.orgData, event.node.props.eventKey)
        }
    }

    public onSelect = (keys: any, event: any): void => {
        const key = keys[0].substring(0, 3)
        this.setState({
            checkedKeys: key
        }, (): void => {
            this.getRightOperation()
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
                fullName: event.node.props.title,
                rightOperationData: []
            }, (): void => {
                this.getFileDelete()
            })
        } else if (key === '272') {
            console.log('这是通道')
            this.setState({
                siteId: event.node.props.siteId,
                fullName: event.node.props.title
            }, (): void => {
                this.treeparent(this.state.orgData, event.node.props.eventKey)
            })
        } else if (key === 'und') {
            console.log('这是分机信息')
            this.setState({
                siteId: event.node.props.siteId,
                fullName: event.node.props.title
            }, (): void => {
                this.treeparent1(this.state.orgData, [event.node.props.eventKey])
            })
        } else if (key === '273') {
            console.log('这是归档')
            this.setState({
                siteId: event.node.props.siteId,
                fullName: event.node.props.title
            }, (): void => {
                if (this.state.recordservice.length !== 0 && this.state.recordservice[0].startArchive === 0) {
                    this.setState({
                        rightOperationData: []
                    })
                    message.warning(`${intl.get('M26P102261011091100PM001').d('请在录音服务开启归档')}`)
                } else {
                    this.getRightOperation1()
                }
                this.treeparent(this.state.orgData, event.node.props.eventKey)
            })
        } else if (key === '274') {
            console.log('这是回删')
            this.setState({
                siteId: event.node.props.siteId,
                fullName: event.node.props.title
            }, (): void => {
                if (this.state.recordservice.length !== 0 && this.state.recordservice[0].startDelete === 0) {
                    this.setState({
                        rightOperationData: []
                    })
                    message.warning(`${intl.get('M26P102261011091100PM002').d('请在录音服务开启回删')}`)
                } else {
                    this.getRightOperation2()
                }
                this.treeparent(this.state.orgData, event.node.props.eventKey)
            })
        } else if (key === '275') {
            console.log('这是下载')
            this.setState({
                siteId: event.node.props.siteId,
                fullName: event.node.props.title
            }, (): void => {
                this.getRightOperation3()
                this.treeparent(this.state.orgData, event.node.props.eventKey)
            })
        }
    }

    // 判断点击树的上一级
    public treeparent = async (data, id): Promise<void> => {
        let serverkey
        for (const item of data) {
            if (item.children) {
                for (let k = 0; k < item.children.length; k++) {
                    if (item.children[k].key === id) {
                        serverkey = item.title
                        this.setState({
                            serverKey: serverkey
                        })
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
                if (serverkey === item.ipaddress) {
                    this.setState({
                        currentServer: item
                    }, (): void => {
                        this.getDeleteData()
                        this.getDownloadData()
                        this.getRecordFileData()
                    })
                }
            }
        }
    }

    public treeparent1 = (data, id: string[]): void => {
        let ServerIp
        for (const item of data) {
            if (item.children) {
                for (let k = 0; k < item.children.length; k++) {
                    if (item.children[k].key === id[(id.length - 1)]) {
                        id.push(item.key)
                        if (id.length < 3) {
                            this.treeparent1(this.state.orgData, id)
                        } else {
                            ServerIp = item.title
                            break
                        }
                    } else if (k === item.children.length - 1) {
                        this.treeparent1(item.children, id)
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
        _getRecordConfig(data1).then((res: any): void => {
            if (res && res.result && res.data !== 'null') {
                const newData = res.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
                const serverdata = JSON.parse(newData)
                for (const item of serverdata) {
                    if (ServerIp === item.ipaddress) {
                        this.setState({
                            currentServer: item
                        }, (): void => {
                            this.getChannel()
                        })
                    }
                }
            }
        })
    }

    public rightIdData = (data): void => {
        this.setState({
            FuctionId: data.P005
        }, (): void => {
            console.log(this.state.FuctionId)
        })
        if (data.P003 === 'OP10226101109110101') {
            this.setState({
                channelVisible: true,
                editType: 1
            })
        } else if (data.P003 === 'OP10226101109110102') {
            this.deleteRecordConfig()
        } else if (data.P003 === 'OP10226101109110103') {
            this.setState({
                channelVisible: true,
                editType: 2
            })
        } else if (data.P003 === 'OP10226101109110301') {
            this.getstorage()
            this.setState({
                recordFileVisible: true,
                editType: 1
            })
        } else if (data.P003 === 'OP10226101109110302') {
            if (JSON.stringify(this.state.recordFileInfoData) === '{}') {
                message.warning(`${intl.get('M26P102261011091100PM003').d('请先选择归档')}`)
            } else {
                this.deleteRecordFile()
            }
        } else if (data.P003 === 'OP10226101109110303') {
            if (JSON.stringify(this.state.recordFileInfoData) === '{}') {
                message.warning(`${intl.get('M26P102261011091100PM003').d('请先选择归档')}`)
            } else {
                this.getstorage()
                this.setState({
                    recordFileVisible: true,
                    editType: 2
                })
            }
        } else if (data.P003 === 'OP10226101109110401') {
            this.setState({
                deleteVisible: true,
                editType: 2
            })
        } else if (data.P003 === 'OP10226101109110201') {
            this.setState({
                downloadVisible: true,
                editType: 1
            })
        } else if (data.P003 === 'OP10226101109110202') {
            if (JSON.stringify(this.state.downloadInfoData) === '{}') {
                message.warning(`${intl.get('M26P102261011091100PM003').d('请先选择下载')}`)
            } else {
                this.deleteDownload()
            }
        } else if (data.P003 === 'OP10226101109110203') {
            if (JSON.stringify(this.state.downloadInfoData) === '{}') {
                message.warning(`${intl.get('M26P102261011091100PM004').d('请先选择下载')}`)
            } else {
                this.setState({
                    downloadVisible: true,
                    editType: 2
                })
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

    // 获取归档回删信息
    public getFileDelete = async (): Promise<void> => {
        const data1 = {
            params: {
                system_id: Number(this.state.checkedKeys),
                site_id: this.state.siteId
            }
        }
        const res1: any = await _getRecordConfig(data1)
        let currentData1
        if (res1 && res1.result && res1.data !== 'null') {
            const newData = res1.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
            const currentData = JSON.parse(newData)
            for (const item of currentData) {
                if (item.full_name === this.state.fullName) {
                    currentData1 = item
                }
            }
        }
        const data = {
            params: {
                system_id: 271,
                site_id: this.state.siteId,
                guid: currentData1.guid
            }
        }
        const res: any = await _getRecordConfig(data)
        if (res && res.result && res.data !== 'null') {
            const newData = res.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
            const infodata = JSON.parse(newData)
            this.setState({
                recordservice: infodata
            })
        }
    }

    // 获取顶级机构
    public getOrg = async (): Promise<void> => {
        const res: any = await _getOrg()
        if (res && res.result) {
            const treedata = []
            res.data.forEach((item: any): void => {
                treedata.push({ title: item.full_name, key: `${item.system_id}${Math.floor(Math.random() * 10000)}` })
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
                            treedata.push({ title: item.full_name, key: `${item.system_id}${Math.floor(Math.random() * 10000)}`, siteId: item.siteid })
                        })
                        treeNode.props.dataRef.children = treedata
                        this.setState((prevState: any): any => ({
                            orgData: [...prevState.orgData]
                        }))
                    }
                    resolve()
                })
            }
            if (this.state.siteId !== undefined && treeNode.props.eventKey.substring(0, 3) === '270') {
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
                _getRecordConfig(data).then((res: any): void => {
                    if (res && res.result && res.data !== 'null') {
                        const serverData = JSON.parse(res.data)
                        const orgdata = JSON.parse(JSON.stringify(this.state.orgData))
                        const treedata = []
                        serverData.forEach((item: any): void => {
                            treedata.push({ title: item.full_name, key: `${item.system_id}${Math.floor(Math.random() * 10000)}`, siteId: item.siteid })
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
            if (this.state.siteId !== undefined && treeNode.props.eventKey.substring(0, 3) === '289') {
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
                _getRecordConfig(data).then((res: any): void => {
                    if (res && res.result && res.data !== 'null') {
                        const serverData = JSON.parse(res.data)
                        const orgdata = JSON.parse(JSON.stringify(this.state.orgData))
                        for (const item of orgdata[0].children) {
                            for (const item1 of serverData) {
                                if (item1.siteId === item.siteid) {
                                    if (item.children[0].children) {
                                        treeNode.props.dataRef.children = [
                                            { key: `272${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011091100MT001').d('录音通道')}`, siteId: item.siteId },
                                            { key: `273${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011091100MT002').d('归档')}`, siteId: item.siteId, isLeaf: true },
                                            { key: `274${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011091100MT003').d('回删')}`, siteId: item.siteId, isLeaf: true },
                                            { key: `275${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011091100MT004').d('下载')}`, siteId: item.siteId, isLeaf: true }
                                        ]
                                    } else {
                                        treeNode.props.dataRef.children = [
                                            { key: `272${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011091100MT001').d('录音通道')}`, siteId: item.siteId },
                                            { key: `273${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011091100MT002').d('归档')}`, siteId: item.siteId, isLeaf: true },
                                            { key: `274${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011091100MT003').d('回删')}`, siteId: item.siteId, isLeaf: true },
                                            { key: `275${Math.floor(Math.random() * 10000000)}`, title: `${intl.get('M26P102261011091100MT004').d('下载')}`, siteId: item.siteId, isLeaf: true }
                                        ]
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
            if (treeNode.props.eventKey.substring(0, 3) === '272') {
                if (treeNode.props.children) {
                    resolve()
                    return
                }
                const data1 = {
                    params: {
                        system_id: 289,
                        site_id: this.state.siteId
                    }
                }
                let currentServer1
                _getRecordConfig(data1).then((res: any): void => {
                    if (res && res.result && res.data !== 'null') {
                        const newData = res.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
                        const serverdata = JSON.parse(newData)
                        for (const item of serverdata) {
                            if (this.state.serverKey === item.ipaddress) {
                                currentServer1 = item
                                this.setState({
                                    currentServer: currentServer1
                                }, (): void => {
                                    if (treeNode.props.children) {
                                        resolve()
                                        return
                                    }
                                    const data = {
                                        params: {
                                            site_id: this.state.siteId,
                                            record_service_id: this.state.currentServer.deviceid
                                        }
                                    }
                                    _getChannel(data).then((res1: any): void => {
                                        if (res1 && res1.result && res1.data !== 'null') {
                                            const channelData = JSON.parse(res1.data)
                                            const orgdata = JSON.parse(JSON.stringify(this.state.orgData))
                                            const treedata = []
                                            let channel
                                            channelData.forEach((itemData: any): void => {
                                                if (itemData.channelid.toString().length === 1) {
                                                    channel = `${'000'}${itemData.channelid}`
                                                } else if (itemData.channelid.toString().length === 2) {
                                                    channel = `${'00'}${itemData.channelid}`
                                                } else if (itemData.channelid.toString().length === 3) {
                                                    channel = `${'0'}${itemData.channelid}`
                                                } else {
                                                    channel = itemData.channelid
                                                }
                                                treedata.push({ title: `(${channel}) ${itemData.full_name}`, key: `${itemData.system_id}${Math.floor(Math.random() * 10000000)}`, siteId: itemData.siteid, isLeaf: true })
                                            })
                                            for (const itemData of orgdata[0].children) {
                                                for (const item1 of treedata) {
                                                    if (item1.siteId === itemData.siteId) {
                                                        if (itemData.children[0].children) {
                                                            if (itemData.children[0].children[0].children) {
                                                                treeNode.props.dataRef.children = treedata
                                                            } else {
                                                                treeNode.props.dataRef.children = treedata
                                                            }
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
                                })
                            }
                        }
                    }
                })
            }
        })
    )

    // 获取录音通道信息
    public getChannel = async (): Promise<void> => {
        const data = {
            params: {
                site_id: this.state.siteId,
                record_service_id: this.state.currentServer.deviceid
            }
        }
        const res: any = await _getChannel(data)
        if (res && res.result && res.data !== 'null') {
            let currentData
            const channelData = JSON.parse(res.data)
            let channel
            for (const item of channelData) {
                if (item.channelid.toString().length === 1) {
                    channel = `${'000'}${item.channelid}`
                } else if (item.channelid.toString().length === 2) {
                    channel = `${'00'}${item.channelid}`
                } else if (item.channelid.toString().length === 3) {
                    channel = `${'0'}${item.channelid}`
                } else {
                    channel = item.channelid
                }
                if (`(${channel}) ${item.full_name}` === this.state.fullName) {
                    currentData = item
                }
            }
            this.setState({
                channelInfo: currentData
            })
        } else if (res && res.result) {
            this.setState({
                channelInfo: []
            })
        }
    }

    // 获取下载
    public getDownloadData = async (): Promise<void> => {
        const data = {
            params: {
                site_id: Number(this.state.siteId),
                record_service_id: Number(this.state.currentServer.deviceid)
            }
        }
        const res: any = await _getDownload(data)
        if (res && res.result && res.data !== 'null') {
            const downloadData = JSON.parse(res.data)
            this.setState({
                downloadInfo: downloadData
            })
        } else if (res && res.result) {
            this.setState({
                downloadInfo: []
            })
        }
    }

    // 获取回删
    public getDeleteData = async (): Promise<void> => {
        const data = {
            params: {
                site_id: Number(this.state.siteId),
                record_service_id: Number(this.state.currentServer.deviceid)
            }
        }
        const res: any = await _getDelete(data)
        if (res && res.result && res.data !== 'null') {
            const deleteData = JSON.parse(res.data)
            this.setState({
                deleteInfo: deleteData
            })
        } else if (res && res.result) {
            this.setState({
                deleteInfo: []
            })
        }
    }

    // 获取归档
    public getRecordFileData = async (): Promise<void> => {
        const data = {
            params: {
                site_id: Number(this.state.siteId),
                record_service_id: Number(this.state.currentServer.deviceid)
            }
        }
        const res: any = await _getRecordFile(data)
        if (res && res.result && res.data !== 'null') {
            const Data = JSON.parse(res.data)
            this.setState({
                recordFileInfo: Data
            })
        } else if (res && res.result) {
            this.setState({
                recordFileInfo: []
            })
        }
    }


    // 获取站点下的所有存储设备
    public getstorage = async (): Promise<void> => {
        const data = {
            params: {
                system_id: 288,
                site_id: this.state.siteId
            }
        }
        const res: any = await _getRecordConfig(data)
        if (res && res.result && res.data !== 'null') {
            const storagedata = JSON.parse(res.data)
            this.setState({
                storageData: storagedata
            })
        }
    }

    // 添加通道
    public channelData = (data): void => {
        const channeldata = {
            site_id: this.state.siteId,
            record_service_id: this.state.currentServer.deviceid,
            recorder_id: 311727700,
            channel_id: data.channelId,
            channel_name: data.channelName,
            extension_id: Number(data.extensionId),
            phone_ip: data.phoneIp,
            phone_port: data.phonePort,
            start_mode: Number(data.startMode),
            start_dtmf: data.startDtmf,
            stop_dtmf: data.stopDtmf,
            record_file_code: Number(data.recordFileCode),
            coding_format: Number(data.codingFormat),
            min_record_duration: data.minRecordDuration,
            max_record_duration: data.maxRecordDuration,
            cutting_record: data.cuttingRecord === true ? 1 : 0,
            choice_record: data.choiceRecord,
            record_time_range: data.recordTimeRange,
            description: data.description,
            channel_count: Number(data.channelCount),
            operation_type: 1,
            extension_password: '',
            phone_ip2: 0,
            retain_record_dtmf: 1,
            double_track: data.doubleTrack === true ? 1 : 0,
            function_id: this.state.FuctionId
        }
        this.setState((): any => ({
            channelData: channeldata
        }))
    }

    public handleChannel = (): void => {
        this.addChannel()
    }

    public addChannel = async (): Promise<void> => {
        const res: any = await _addChannel(this.state.channelData)
        if (res && res.result) {
            this.setState({
                channelVisible: false
            })
            const channelData = JSON.parse(JSON.stringify(this.state.channelData))
            const treedata = []
            let channel
            if (channelData.channel_id.toString().length === 1) {
                channel = `${'000'}${channelData.channel_id}`
            } else if (channelData.channel_id.toString().length === 2) {
                channel = `${'00'}${channelData.channel_id}`
            } else if (channelData.channel_id.toString().length === 3) {
                channel = `${'0'}${channelData.channel_id}`
            } else {
                channel = channelData.channel_id
            }
            // 判断分机号个数 做更新树节点的判断
            if (Number(this.state.channelData.channel_count) > 1) {
                for (let i = 0; i < this.state.channelData.channel_count; i++) {
                    let channel1
                    if (channelData.channel_id.toString().length === 1) {
                        channel1 = `${'000'}${channelData.channel_id + i}`
                    } else if (channelData.channel_id.toString().length === 2) {
                        channel1 = `${'00'}${channelData.channel_id + i}`
                    } else if (channelData.channel_id.toString().length === 3) {
                        channel1 = `${'0'}${channelData.channel_id + i}`
                    } else {
                        channel1 = channelData.channel_id
                    }
                    treedata.push({ title: `(${channel1}) ${channelData.extension_id + i}`, key: `${channelData.system_id}${Math.floor(Math.random() * 10000000)}`, siteId: channelData.site_id, isLeaf: true, tit: `${intl.get('M26P102261011091100MT001').d('录音通道')}` })
                }
            } else {
                treedata.push({ title: `(${channel}) ${channelData.extension_id}`, key: `${channelData.system_id}${Math.floor(Math.random() * 10000000)}`, siteId: channelData.site_id, isLeaf: true, tit: `${intl.get('M26P102261011091100MT001').d('录音通道')}` })
            }
            this.insertNode(this.state.orgData, treedata)
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
            onOk: (): void => {
                this.delete()
            }
        })
    }

    public delete = async (): Promise<void> => {
        const currentData = JSON.parse(JSON.stringify(this.state.channelInfo))
        const data = {
            params: {
                recorder_id: currentData.recorderid,
                site_id: Number(this.state.siteId),
                record_service_id: currentData.recordserviceid,
                channel_id: currentData.channelid,
                function_id: this.state.FuctionId
            }
        }
        const res: any = await _deleteChannel(data)
        if (res && res.result) {
            message.success(`${intl.get('COM00100010008').d('操作成功')}`)
            this.deleteNode(this.state.orgData)
        }
    }

    // 修改
    public modifyChannel = async (): Promise<void> => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.channelData))
        const channeldata = {
            site_id: this.state.siteId,
            record_service_id: currentInfo.record_service_id,
            recorder_id: 311727700,
            channel_id: currentInfo.channel_id,
            channel_name: currentInfo.channel_name,
            extension_id: currentInfo.extension_id,
            phone_ip: currentInfo.phone_ip,
            phone_port: currentInfo.phone_port,
            start_mode: Number(currentInfo.start_mode),
            start_dtmf: currentInfo.start_dtmf,
            stop_dtmf: currentInfo.stop_dtmf,
            record_file_code: Number(currentInfo.record_file_code),
            coding_format: Number(currentInfo.coding_format),
            min_record_duration: currentInfo.min_record_duration,
            max_record_duration: currentInfo.max_record_duration,
            cutting_record: currentInfo.cutting_record,
            choice_record: currentInfo.choice_record,
            record_time_range: currentInfo.record_time_range,
            description: currentInfo.description,
            channel_count: currentInfo.channel_count,
            operation_type: 2,
            extension_password: '',
            phone_ip2: 0,
            retain_record_dtmf: 1,
            double_track: currentInfo.double_track,
            function_id: this.state.FuctionId

        }
        const res: any = await _addChannel(channeldata)
        if (res && res.result) {
            // 修改分机号 返回通道id和分机号 设置新newFullName做更新判断
            let channel
            const data = JSON.parse(res.data)
            if (data.ChannelId.toString().length === 1) {
                channel = `${'000'}${data.ChannelId}`
            } else if (data.ChannelId.toString().length === 2) {
                channel = `${'00'}${data.ChannelId}`
            } else if (data.data.toString().length === 3) {
                channel = `${'0'}${data.ChannelId}`
            } else {
                channel = data.ChannelId
            }
            this.setState({
                channelVisible: false,
                newFullName: `(${channel}) ${data.ExtensionId}`
            })
            this.undateNode(this.state.orgData, this.state.channelInfo)
            // 修改后重新调用当前分机信息
            const data1 = {
                params: {
                    site_id: this.state.siteId,
                    record_service_id: this.state.currentServer.deviceid
                }
            }
            const res1: any = await _getChannel(data1)
            if (res1 && res1.result && res1.data !== 'null') {
                let currentData
                const channelData = JSON.parse(res1.data)
                let channel1
                console.log(channelData)
                for (const item of channelData) {
                    if (item.channelid.toString().length === 1) {
                        channel1 = `${'000'}${item.channelid}`
                    } else if (item.channelid.toString().length === 2) {
                        channel1 = `${'00'}${item.channelid}`
                    } else if (item.channelid.toString().length === 3) {
                        channel1 = `${'0'}${item.channelid}`
                    } else {
                        channel1 = item.channelid
                    }
                    if (`(${channel1}) ${item.full_name}` === this.state.newFullName) {
                        currentData = item
                    }
                }
                this.setState({
                    channelInfo: currentData
                })
            } else if (res && res.result) {
                this.setState({
                    channelInfo: []
                })
            }
        }
    }

    public recordFileData = (data): void => {
        const recordFiledata = {
            recorder_id: 311727700,
            site_id: this.state.siteId,
            record_service_id: this.state.currentServer.deviceid,
            storage_device_id: data.storageDeviceId,
            oldstorage_device_id: '',
            try_file_count: data.tryFileCount,
            file_time_slot: '',
            route_config: data.routeConfig,
            state: data.state === true ? 1 : 0,
            description: '',
            operation_type: 1,
            function_id: this.state.FuctionId
        }
        this.setState((): any => ({
            recordFileData: recordFiledata
        }))
    }

    public handleRecordFile = (): void => {
        this.addRecordFile()
    }

    public addRecordFile = async (): Promise<void> => {
        const res: any = await _addRecordFile(this.state.recordFileData)
        if (res && res.result) {
            this.setState({
                recordFileVisible: false
            })
            this.getRecordFileData()
        }
    }

    public recordFileInfoData = (data): void => {
        this.setState({
            recordFileInfoData: data
        })
    }

    // 删除归档
    public deleteRecordFile = (): void => {
        Modal.confirm({
            title: `${intl.get('M26P102261011090100MT006').d('确定删除吗?')}`,
            content: '',
            okText: `${intl.get('COM00100010001').d('确定')}`,
            cancelText: `${intl.get('COM00100010003').d('取消')}`,
            okType: 'danger',
            onOk: (): void => {
                this.deleteRf()
            }
        })
    }

    public deleteRf = async (): Promise<void> => {
        const data = {
            params: {
                recorder_id: 311727700,
                site_id: Number(this.state.recordFileInfoData.siteid),
                record_service_id: this.state.recordFileInfoData.recordserviceid,
                storage_device_id: this.state.recordFileInfoData.storagedeviceid,
                function_id: this.state.FuctionId
            }
        }
        const res: any = await _deleteRecordFile(data)
        if (res && res.result) {
            message.success(`${intl.get('COM00100010008').d('操作成功')}`)
            this.getRecordFileData()
        }
    }

    // 修改归档
    public modifyRecordFile = async (): Promise<void> => {
        const recordFiledata = {
            recorder_id: 311727700,
            site_id: this.state.siteId,
            record_service_id: this.state.currentServer.deviceid,
            storage_device_id: this.state.recordFileData.storage_device_id,
            oldstorage_device_id: this.state.recordFileInfoData.storagedeviceid,
            try_file_count: this.state.recordFileData.try_file_count,
            file_time_slot: '',
            route_config: this.state.recordFileData.route_config,
            state: this.state.recordFileData.state,
            description: '',
            operation_type: 2,
            function_id: this.state.FuctionId
        }
        const res: any = await _addRecordFile(recordFiledata)
        if (res && res.result) {
            this.setState({
                recordFileVisible: false
            })
            this.getRecordFileData()
        }
    }

    public homeDirectoryData = (data: any): void => {
        this.setState({
            driveLetter: data
        })
    }

    public homeDirectoryData1 = (data: any): void => {
        this.setState({
            directory: data
        })
    }

    // 增加下载
    public downloadData = (data): void => {
        const downloaddata = {
            recorder_id: 311727700,
            site_id: this.state.siteId,
            record_service_id: this.state.currentServer.deviceid,
            serial_number: data.serialNumber,
            download_type: Number(data.downloadType),
            address: data.address,
            port: data.port,
            account: data.account,
            password: data.password,
            pattern_type: Number(data.patternType),
            description: data.description,
            operation_type: 1,
            function_id: this.state.FuctionId
        }
        this.setState((): any => ({
            downloadData: downloaddata
        }))
    }

    public handleDwonload = (): void => {
        this.addDownload()
    }

    public addDownload = async (): Promise<void> => {
        const data = JSON.parse(JSON.stringify(this.state.downloadData))
        let directory
        if (this.state.directory !== undefined) {
            directory = this.state.directory.slice(0, -1)
        } else {
            directory = ''
        }
        data.drive_letter = this.state.driveLetter
        data.directory = directory
        const res: any = await _addDownload(data)
        if (res && res.result) {
            this.setState({
                downloadVisible: false
            })
            this.getDownloadData()
        }
    }

    // 点击下载表格返回过来的详细数据
    public downloadInfoData = (data): void => {
        this.setState({
            downloadInfoData: data
        })
    }

    // 删除下载
    public deleteDownload = (): void => {
        Modal.confirm({
            title: `${intl.get('M26P102261011090100MT006').d('确定删除吗?')}`,
            content: '',
            okText: `${intl.get('COM00100010001').d('确定')}`,
            cancelText: `${intl.get('COM00100010003').d('取消')}`,
            okType: 'danger',
            onOk: (): void => {
                this.deleteDw()
            }
        })
    }

    public deleteDw = async (): Promise<void> => {
        const data = {
            params: {
                recorder_id: 311727700,
                site_id: Number(this.state.downloadInfoData.SiteId),
                record_service_id: this.state.downloadInfoData.RecordServiceId,
                serial_number: this.state.downloadInfoData.SerialNumber,
                function_id: this.state.FuctionId
            }
        }
        const res: any = await _deleteDownload(data)
        if (res && res.result) {
            message.success(`${intl.get('COM00100010008').d('操作成功')}`)
            this.getDownloadData()
        }
    }

    // 修改下载
    public modifyDwonload = async (): Promise<void> => {
        const downloaddata = {
            recorder_id: 311727700,
            site_id: this.state.siteId,
            record_service_id: this.state.currentServer.deviceid,
            serial_number: this.state.downloadData.serial_number,
            drive_letter: this.state.driveLetter,
            download_type: Number(this.state.downloadData.download_type),
            address: this.state.downloadData.address,
            port: this.state.downloadData.port,
            account: this.state.downloadData.account,
            password: this.state.downloadData.password,
            directory: this.state.directory,
            pattern_type: Number(this.state.downloadData.pattern_type),
            description: this.state.downloadData.description,
            operation_type: 2,
            function_id: this.state.FuctionId
        }
        const res: any = await _addDownload(downloaddata)
        if (res && res.result) {
            this.setState({
                downloadVisible: false
            })
            this.getDownloadData()
        }
    }

    // 编辑回删
    public deleteData = (data): void => {
        let deleteType
        if (this.state.deleteInfo.length === 0) {
            deleteType = 1
        } else {
            deleteType = 2
        }
        let deleteMethod
        if (data.method.indexOf(1) === -1) {
            deleteMethod = -1
        } else {
            deleteMethod = data.deleteMethod
        }
        let deleteConfig
        if (data.method.indexOf(2) === -1) {
            deleteConfig = -1
        } else {
            deleteConfig = data.deleteConfig
        }
        const deletedata = {
            recorder_id: 311727700,
            site_id: this.state.siteId,
            record_service_id: this.state.currentServer.deviceid,
            delete_method: Number(deleteMethod),
            delete_config: deleteConfig,
            retention_days: Number(data.retentionDays),
            delete_database: data.deleteDatabase === true ? 1 : 0,
            locked_record: data.lockedRecord === true ? 1 : 0,
            description: data.description,
            state: data.state === true ? 1 : 0,
            operation_type: deleteType,
            function_id: this.state.FuctionId
        }
        this.setState((): any => ({
            deleteData: deletedata
        }))
    }

    public handleDelete = (): void => {
        this.addDelete()
    }

    public addDelete = async (): Promise<void> => {
        const res: any = await _addDelete(this.state.deleteData)
        if (res && res.result) {
            this.setState({
                deleteVisible: false
            })
            this.getDeleteData()
        }
    }

    // 新增节点
    public insertNode = (tData, newdata): void => {
        if (newdata.length < 2) {
            if (newdata[0] !== undefined && this.state.checkedKeys === '272') {
                for (const data of tData) {
                    if (data.title === newdata[0].tit && data.siteId === newdata[0].siteId) {
                        if (data.children) {
                            data.children.push(newdata[0])
                        } else {
                            data.children = newdata
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
        if (newdata.length > 1) {
            if (this.state.checkedKeys === '272') {
                for (const data of tData) {
                    if (data.title === newdata[0].tit && data.siteId === newdata[0].siteId) {
                        if (data.children) {
                            data.children = data.children.concat(newdata)
                        } else {
                            data.children = newdata
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
    }

    // 更新节点
    public undateNode = (tData, data): any => {
        for (const item of tData) {
            if (item.title === this.state.fullName) {
                item.title = this.state.newFullName
                this.setState((prevState: any): any => ({
                    orgData: [...prevState.orgData]
                }))
            } else if (item.children && item.children.length > 0) {
                this.undateNode(item.children, data)
            }
        }
    }

    // 删除节点
    public deleteNode = (tData): void => {
        for (let i = 0; i < tData.length; i++) {
            if (tData[i].title === this.state.fullName) {
                tData.splice(i, 1)
                this.setState((prevState: any): any => ({
                    orgData: [...prevState.orgData],
                    channelInfo: []
                }))
            } else if (tData[i].children && tData[i].children.length > 0) {
                this.deleteNode(tData[i].children)
            }
        }
    }

    public render(): React.ReactElement {
        return (
            <div className={styles.main}>
                <div className={styles.content}>
                    <div style={{ overflow: 'auto' }} className={styles.contentLeft}>
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
                        {this.state.checkedKeys === 'und' ? <ChannelInfo dataInfo={this.state.channelInfo} /> : null}
                        {this.state.checkedKeys === '273' && this.state.recordFileInfo.length !== 0 ? <RecordFileInfo dataInfo={this.state.recordFileInfo} recordFIleInfo={(data: any): void => this.recordFileInfoData(data)} /> : null}
                        {this.state.checkedKeys === '274' && this.state.deleteInfo.length !== 0 ? <DeleteInfo dataInfo={this.state.deleteInfo} /> : null}
                        {this.state.checkedKeys === '275' && this.state.downloadInfo !== 0 ? <DownloadInfo downloadInfo={(data: any): void => this.downloadInfoData(data)} dataInfo={this.state.downloadInfo} /> : null}
                    </div>
                </div>
                <RightOperation rightOperationData={this.state.rightOperationData} operateCallBack={(data): void => this.rightIdData(data)} />
                <DraggableModal
                    visible={this.state.channelVisible}
                    title={intl.get('M26P102261011091100MT001').d('录音通道')}
                    width={600}
                    onOk={(): void => { this.handleChannel() }}
                    onCancel={(): void => { this.setState({ channelVisible: false }) }}
                    footer={
                        <div>
                            <Button style={{ marginLeft: '15px' }} onClick={(): void => { this.setState({ channelVisible: false }) }}>{intl.get('COM00100010003').d('取消')}</Button>
                            {this.state.editType === 2 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.modifyChannel() }}>{intl.get('M26P102261011090100MB002').d('修改')}</Button> :
                                null}
                            {this.state.editType === 1 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.handleChannel() }}>{intl.get('COM00100010001').d('确定')}</Button> :
                                null}
                        </div>
                    }
                >
                    <AddChannel siteId={this.state.siteId} currentServer={this.state.currentServer} editType={this.state.editType} dataInfo={this.state.channelInfo} channel={(data: any): void => this.channelData(data)} />
                </DraggableModal>
                <DraggableModal
                    visible={this.state.recordFileVisible}
                    title={intl.get('M26P102261011091100MT002').d('归档')}
                    width={600}
                    onOk={(): void => { this.handleRecordFile() }}
                    onCancel={(): void => { this.setState({ recordFileVisible: false }) }}
                    footer={
                        <div>
                            <Button style={{ marginLeft: '15px' }} onClick={(): void => { this.setState({ recordFileVisible: false }) }}>{intl.get('COM00100010003').d('取消')}</Button>
                            {this.state.editType === 2 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.modifyRecordFile() }}>{intl.get('M26P102261011090100MB002').d('修改')}</Button> :
                                null}
                            {this.state.editType === 1 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.handleRecordFile() }}>{intl.get('COM00100010001').d('确定')}</Button> :
                                null}
                        </div>
                    }
                >
                    <RecordFile editType={this.state.editType} recordFileInfoData={this.state.recordFileInfoData} storageData={this.state.storageData} recordFile={(data: any): void => this.recordFileData(data)} />
                </DraggableModal>
                <DraggableModal
                    visible={this.state.downloadVisible}
                    title={intl.get('M26P102261011091100MT004').d('下载')}
                    width={600}
                    bodyStyle={{ height: '450px', overflow: 'auto' }}
                    onOk={(): void => { this.handleDwonload() }}
                    onCancel={(): void => { this.setState({ downloadVisible: false }) }}
                    footer={
                        <div>
                            <Button style={{ marginLeft: '15px' }} onClick={(): void => { this.setState({ downloadVisible: false }) }}>{intl.get('COM00100010003').d('取消')}</Button>
                            {this.state.editType === 2 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.modifyDwonload() }}>{intl.get('M26P102261011090100MB002').d('修改')}</Button> :
                                null}
                            {this.state.editType === 1 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.handleDwonload() }}>{intl.get('COM00100010001').d('确定')}</Button> :
                                null}
                        </div>
                    }
                >
                    <Download dataInfo={this.state.currentServer} editType={this.state.editType} downloadInfoData={this.state.downloadInfoData} homeDirectory={(data: any): void => this.homeDirectoryData(data)} homeDirectory1={(data: any): void => this.homeDirectoryData1(data)} download={(data: any): void => this.downloadData(data)} />
                </DraggableModal>
                <DraggableModal
                    visible={this.state.deleteVisible}
                    title={intl.get('M26P102261011091100MT003').d('回删')}
                    width={680}
                    onOk={(): void => { this.handleDelete() }}
                    onCancel={(): void => { this.setState({ deleteVisible: false }) }}
                >
                    <Delete deleteInfo={this.state.deleteInfo} delete={(data: any): void => this.deleteData(data)} />
                </DraggableModal>
            </div>
        )
    }
}


export default Passageway