import * as React from 'react'
import { Tree, Modal, Button, message, Row, Col, Select } from 'antd'
import intl from 'react-intl-universal'
import moment from 'moment'
import RightOperation from '../../components/containers/right-operation/rightOperation'
import { _getrightOperation, _getOrg, _getLocalMachine, _getRecordConfig, _deleteConfig } from '../../common/api/siteManage'
import { _addDBBridge, _addDBBridgeDatabase, _getDataBaseList } from '../../common/api/DBBridge'
import DraggableModal from '../../components/cores/draggableModal/draggableModal'
import DBBridge from './DBBridge/DBBridge'
import DBBridgeInfo from './DBBridgeInfo/DBBridgeInfo'
import styles from './index.module.less'

interface IState {
    rightOperationData: any[]; // 左右操作数据
    orgData: any[]; // 左侧输数据
    localMachineInfo: any; // 获取站点传参数据
    editType: number; // 判断是增加还是修改类型
    checkedKeys: string; // 选中
    DBBridgeVisible: boolean; // DBBridge弹出框状态
    dataBaseVisible: boolean; // 选择数据库弹出框状态
    siteId: string; // 站点id
    fullName: string; // 选择树设置的名字用来做判断
    DBBridgeData: IDBBridge; // DBBridge 数据
    currentInfo: any[]; // 选中树的当前中间部分要显示的数据
    dataBase: any[]; // 选择数据库显示的数据
    databaseValue: number; // 选择数据库后的值
    serverData: any[]; // 服务器数据
    databaseName: any[]; // 当前的数据库信息
    dbId: any; // id用来做判断
    dataBaseData: any[]; // 点击数据库的信息
    FuctionId: string;
}
class DBBridgeContent extends React.Component<any, IState> {
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
            editType: 1,
            checkedKeys: '',
            DBBridgeVisible: false,
            dataBaseVisible: false,
            siteId: '',
            fullName: '',
            DBBridgeData: {
                system_id: 0,
                site_id: 1,
                state: 1,
                restful_port: null,
                websocket_port: 2640,
                log_level: 2,
                alias: '',
                guid: null,
                alarm_push: null,
                restart_time: null,
                description: ''
            },
            currentInfo: [], // 当前配置信息
            dataBase: [],
            databaseValue: null,
            serverData: [],
            databaseName: [],
            dbId: '',
            dataBaseData: [],
            FuctionId: ''
        }
    }

    public componentDidMount(): void {
        this.getOrg()
    }

    // 获取右侧菜单
    public getRightOperation = async (): Promise<void> => {
        let id
        if (this.state.checkedKeys === '270') {
            id = '270'
        } else if (this.state.checkedKeys === '273') {
            id = '273'
        }
        const rightdata = {
            params: {
                parent_id: '1022610110903000000',
                resource_id: id
            }
        }
        const res: any = await _getrightOperation(rightdata)
        if (res && res.result) {
            const data = res.data[0]
            const rightOperation = data.P004
            this.setState({
                rightOperationData: rightOperation
            })
        }
    }

    // 删除数据库获取右侧菜单
    public getRightOperation1 = async (): Promise<void> => {
        const rightdata = {
            params: {
                parent_id: '1022610110903000000',
                resource_id: '286'
            }
        }
        const res: any = await _getrightOperation(rightdata)
        if (res && res.result) {
            const data = res.data[0]
            const rightOperation = data.P004
            this.setState({
                rightOperationData: rightOperation
            })
        }
    }

    public deleteDatabase = (data): void => {
        this.setState({
            dataBaseData: data
        })
        this.getRightOperation1()
    }

    // 删除数据库
    public deletedatabaseConfig = (): void => {
        Modal.confirm({
            title: `${intl.get('M26P102261011090100MT006').d('确定删除吗?')}`,
            content: '',
            okText: `${intl.get('COM00100010001').d('确定')}`,
            cancelText: `${intl.get('COM00100010003').d('取消')}`,
            okType: 'danger',
            onCancel: (): void => { console.log('cancle') },
            onOk: (): void => {
                this.deletedatabase()
            }
        })
    }

    public deletedatabase = async (): Promise<void> => {
        const currentData = JSON.parse(JSON.stringify(this.state.currentInfo))
        const dataBaseData = JSON.parse(JSON.stringify(this.state.dataBaseData))
        const data = {
            params: {
                system_id: 286,
                site_id: Number(this.state.siteId),
                delete_code: currentData.dbBridgeId,
                key: dataBaseData.DataBaseKey,
                function_id: this.state.FuctionId
            }
        }
        const res: any = await _deleteConfig(data)
        if (res && res.result) {
            this.getDatabaseName()
        }
    }

    // 启用禁用数据库
    public enableDataBase = async (): Promise<void> => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        console.log(this.state.FuctionId)
        const dataBaseData = JSON.parse(JSON.stringify(this.state.dataBaseData))
        if (dataBaseData.State === 1) {
            const data = {
                system_id: 286,
                site_id: Number(this.state.siteId),
                state: 0,
                db_bridge_id: currentInfo.dbbridgeid,
                description: currentInfo.description,
                database_key: dataBaseData.DataBaseKey,
                function_id: this.state.FuctionId
            }
            const res: any = await _addDBBridgeDatabase(data)
            if (res && res.result) {
                this.getDatabaseName()
                message.success(`${intl.get('COM00100010008').d('操作成功')}`)
            }
        } else if (dataBaseData.State === 0) {
            const data = {
                system_id: 286,
                site_id: Number(this.state.siteId),
                state: 1,
                db_bridge_id: currentInfo.dbbridgeid,
                description: currentInfo.description,
                database_key: dataBaseData.DataBaseKey,
                function_id: this.state.FuctionId
            }
            const res: any = await _addDBBridgeDatabase(data)
            if (res && res.result) {
                this.getDatabaseName()
                message.success(`${intl.get('COM00100010008').d('操作成功')}`)
            }
        }
    }

    // 点右侧操作
    public rightIdData = (data): void => {
        this.setState({
            FuctionId: data.P005
        }, (): void => {
            console.log(this.state.FuctionId)
        })
        if (data.P003 === 'OP102261011090301') {
            console.log('新增DBBridge')
            this.setState({
                DBBridgeVisible: true,
                editType: 1
            })
        } else if (data.P003 === 'OP102261011090302') {
            console.log('删除DBBridge')
            this.deleteRecordConfig()
        } else if (data.P003 === 'OP102261011090303') {
            console.log('编辑DBBridge')
            this.setState({
                DBBridgeVisible: true,
                editType: 2
            })
        } else if (data.P003 === 'OP102261011090305') {
            console.log('启用DBBridge')
            this.enableDBBridge()
        } else if (data.P003 === 'OP102261011090311') {
            console.log('添加数据库')
            this.setState({
                dataBaseVisible: true
            })
            this.getdatabase()
        } else if (data.P003 === 'OP102261011090312') {
            console.log('删除数据库')
            this.deletedatabaseConfig()
        } else if (data.P003 === 'OP102261011090315') {
            console.log('启用禁用数据库')
            this.enableDataBase()
        }
    }

    // 树展开
    public onExpand = (keys: any, event: any): void => {
        console.log('Trigger Select', keys, event)
        this.setState({
            siteId: event.node.props.siteId
        }, (): void => {
            console.log(this.state.siteId)
        })
    }

    // 点击树
    public onSelect = (keys: any, event: any): void => {
        console.log('Trigger Select', keys, event)
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
                siteId: event.node.props.siteId
            }, (): void => {
                this.getRightOperation()
                this.getserver()
            })
        } else if (key === '273') {
            console.log('这是DBBridge')
            this.setState({
                siteId: event.node.props.siteId,
                fullName: event.node.props.title,
                dbId: event.node.props.dbId
            }, (): void => {
                this.getRightOperation()
                this.getCurrentRecordConfig()
                this.getDatabaseName()
            })
        }
    }

    // 渲染树
    public loadTreeNode = (data: any): any => (
        data.map((item): any => {
            if (item.children) {
                return (
                    <Tree.TreeNode title={item.title} key={item.key} siteId={item.siteId} dataRef={item}>
                        {this.loadTreeNode(item.children)}
                    </Tree.TreeNode>
                )
            }
            return <Tree.TreeNode key={item.key} {...item} dataRef={item} siteId={item.siteId} />
        })
    )

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

    // 树异步加载
    public onLoadData = (treeNode: any): any => (
        new Promise((resolve): any => {
            if (treeNode.props.children) {
                resolve()
                return
            }
            // 第一级站点
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
            // 第二级DBBridge
            if (this.state.siteId !== undefined && treeNode.props.eventKey.substring(0, 3) === '270') {
                if (treeNode.props.children) {
                    resolve()
                    return
                }
                const data = {
                    params: {
                        system_id: 273,
                        site_id: this.state.siteId
                    }
                }
                _getRecordConfig(data).then((res: any): void => {
                    if (res && res.result && res.data !== 'null') {
                        const DBBridgeData = JSON.parse(res.data)
                        const orgdata = JSON.parse(JSON.stringify(this.state.orgData))
                        const treedata = []
                        DBBridgeData.forEach((item: any): void => {
                            treedata.push({ title: item.full_name, key: `${item.system_id}${Math.floor(Math.random() * 10000000)}`, dbId: item.dbbridgeid, siteId: item.siteid, isLeaf: true })
                        })
                        for (const item of orgdata[0].children) {
                            for (const item1 of treedata) {
                                if (item1.siteId === item.siteId) {
                                    if (item.children) {
                                        treeNode.props.dataRef.children = treedata
                                    } else {
                                        treeNode.props.dataRef.children = treedata
                                    }
                                }
                            }
                        }
                        this.setState((prevState: any): any => ({
                            orgData: [...prevState.orgData]
                        }))
                    }
                    resolve()
                })
            }
        })
    )

    // 获取服务器信息传给DBBridge
    public getserver = async (): Promise<void> => {
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
            this.setState((): any => ({
                serverData: serverdata
            }))
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
            let currentData1
            const newData = res.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
            const currentData = JSON.parse(newData)
            for (const item of currentData) {
                if (item.dbbridgeid === this.state.dbId) {
                    currentData1 = item
                }
            }
            this.setState({
                currentInfo: currentData1
            }, (): void => {
                this.undateNode(this.state.orgData, this.state.currentInfo)
            })
        }
    }

    // 获取当前DB的数据库信息
    public getDatabaseName = async (): Promise<void> => {
        const data = {
            params: {
                system_id: Number(this.state.checkedKeys),
                site_id: this.state.siteId
            }
        }
        let currentData1
        const res: any = await _getRecordConfig(data)
        if (res && res.result) {
            const currentData = JSON.parse(res.data)
            for (const item of currentData) {
                if (item.full_name === this.state.fullName) {
                    currentData1 = item
                }
            }
        }
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        if (currentInfo.dbbridgeid !== undefined) {
            const data1 = {
                params: {
                    system_id: 286,
                    site_id: this.state.siteId,
                    dbBridgeId: currentData1.dbbridgeid
                }
            }
            const res1: any = await _getRecordConfig(data1)
            if (res1 && res1.result && res1.data) {
                const dataBaseName = JSON.parse(res1.data)
                console.log(dataBaseName)
                this.setState({
                    databaseName: dataBaseName
                })
            }
        }
    }

    // 添加DBBridge
    public DBBridgeData = (data): void => {
        const Data = {
            system_id: 0,
            site_id: this.state.siteId,
            state: 1,
            restful_port: data.restfulPort,
            websocket_port: data.websocketPort,
            log_level: Number(data.logLevel),
            alias: data.alias,
            guid: data.guid,
            alarm_push: data.alarmPush === true ? 1 : 0,
            restart_time: moment(data.restartTime).format('YYYYMMDDHHmmss'),
            description: data.description,
            function_id: this.state.FuctionId
        }
        this.setState((): any => ({
            DBBridgeData: Data
        }))
    }

    public handleDBBridge = (): void => {
        this.addDBBridge()
    }

    public addDBBridge = async (): Promise<void> => {
        const res: any = await _addDBBridge(this.state.DBBridgeData)
        if (res && res.result) {
            this.setState({
                DBBridgeVisible: false
            }, (): void => {
                const DBBridgeData = JSON.parse(JSON.stringify(this.state.DBBridgeData))
                const treedata = {
                    title: DBBridgeData.alias,
                    key: `${273}${Math.floor(Math.random() * 10000000)}`,
                    siteId: DBBridgeData.site_id,
                    isLeaf: true,
                    dbId: res.data
                }
                this.insertNode(this.state.orgData, treedata)
            })
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
        const data = {
            params: {
                system_id: Number(this.state.checkedKeys),
                site_id: Number(this.state.siteId),
                delete_code: currentData.dbBridgeId,
                key: '',
                function_id: this.state.FuctionId
            }
        }
        const res: any = await _deleteConfig(data)
        if (res && res.result) {
            this.deleteNode(this.state.orgData)
            this.setState({
                currentInfo: null
            })
        }
    }

    // 修改
    public modifyDBBridge = async (): Promise<void> => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        const data = {
            system_id: 273,
            site_id: Number(this.state.siteId),
            state: 1,
            restful_port: this.state.DBBridgeData.restful_port,
            websocket_port: this.state.DBBridgeData.websocket_port,
            log_level: Number(this.state.DBBridgeData.log_level),
            alias: this.state.DBBridgeData.alias,
            guid: currentInfo.guid,
            alarm_push: this.state.DBBridgeData.alarm_push,
            restart_time: this.state.DBBridgeData.restart_time,
            description: this.state.DBBridgeData.description,
            db_bridge_id: currentInfo.dbbridgeid,
            function_id: this.state.FuctionId
        }
        const res: any = await _addDBBridge(data)
        if (res && res.result) {
            this.setState({
                DBBridgeVisible: false
            })
            this.getCurrentRecordConfig()
        }
    }

    // 启禁用
    public enableDBBridge = async (): Promise<void> => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        if (currentInfo.state === 1) {
            console.log('这是点击启用')
            const data = {
                system_id: 273,
                site_id: Number(this.state.siteId),
                state: 0,
                restful_port: currentInfo.restfulport,
                websocket_port: currentInfo.websocketport,
                log_level: currentInfo.loglevel,
                alias: currentInfo.alias,
                guid: currentInfo.guid,
                alarm_push: currentInfo.alarmpush,
                restart_time: currentInfo.restarttime,
                description: '',
                db_bridge_id: currentInfo.dbbridgeid,
                function_id: this.state.FuctionId
            }
            const res: any = await _addDBBridge(data)
            if (res && res.result) {
                message.success(`${intl.get('COM00100010008').d('操作成功')}`)
                this.getCurrentRecordConfig()
            }
        } else if (currentInfo.state === 0) {
            const data = {
                system_id: 273,
                site_id: Number(this.state.siteId),
                state: 1,
                restful_port: currentInfo.restfulport,
                websocket_port: currentInfo.websocketport,
                log_level: currentInfo.loglevel,
                alias: currentInfo.alias,
                guid: currentInfo.guid,
                alarm_push: currentInfo.alarmpush,
                restart_time: currentInfo.restarttime,
                description: '',
                db_bridge_id: currentInfo.dbbridgeid,
                function_id: this.state.FuctionId
            }
            const res: any = await _addDBBridge(data)
            if (res && res.result) {
                message.success(`${intl.get('COM00100010008').d('操作成功')}`)
                this.getCurrentRecordConfig()
            }
        }
    }

    // 获取数据库信息
    public getdatabase = async (): Promise<void> => {
        const data = {
            params: {
                system_id: 287,
                site_id: Number(this.state.siteId)
            }
        }
        const res: any = await _getDataBaseList(data)
        if (res && res.result && res.data !== 'null') {
            const dataBaseData = JSON.parse(res.data)
            this.setState({
                dataBase: dataBaseData
            })
        }
    }

    // 选择数据库后的子组件传过来的数据
    public _handleChangeDataBase = (e): void => {
        const value = e
        this.setState({
            databaseValue: value
        })
    }

    // 添加数据库
    public handleDataBase = (): void => {
        this.addDataBase()
    }

    public addDataBase = async (): Promise<void> => {
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        const data = {
            system_id: 0,
            site_id: Number(this.state.siteId),
            state: 1,
            db_bridge_id: currentInfo.dbbridgeid,
            description: currentInfo.description,
            database_key: this.state.databaseValue,
            function_id: this.state.FuctionId
        }
        const res: any = await _addDBBridgeDatabase(data)
        if (res && res.result) {
            this.setState({
                dataBaseVisible: false
            })
            this.getCurrentRecordConfig()
            this.getDatabaseName()
        }
    }

    // 新增节点
    public insertNode = (tData, newdata): void => {
        if (newdata !== undefined && this.state.checkedKeys === '270') {
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
    }

    // 更新节点(更新机构信息,账户信息)
    public undateNode = (tData, data): any => {
        for (const item of tData) {
            if (item.dbId === data.dbbridgeid) {
                item.title = data.full_name
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
        const currentInfo = JSON.parse(JSON.stringify(this.state.currentInfo))
        for (let i = 0; i < tData.length; i++) {
            if (tData[i].dbId === currentInfo.dbbridgeid) {
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
                        {this.state.checkedKeys === '273' && this.state.currentInfo !== null ? <DBBridgeInfo databaseName={this.state.databaseName} serverData={this.state.serverData} dataInfo={this.state.currentInfo} deleteDataBase={(data: any): void => this.deleteDatabase(data)} /> : null}
                    </div>
                </div>
                <RightOperation rightOperationData={this.state.rightOperationData} operateCallBack={(data): void => this.rightIdData(data)} />
                <DraggableModal
                    visible={this.state.DBBridgeVisible}
                    title={intl.get('M26P102261011090500ML026').d('DBbridge')}
                    width={600}
                    onOk={(): void => { this.handleDBBridge() }}
                    onCancel={(): void => { this.setState({ DBBridgeVisible: false }) }}
                    footer={
                        <div>
                            <Button style={{ marginLeft: '15px' }} onClick={(): void => { this.setState({ DBBridgeVisible: false }) }}>{intl.get('COM00100010003').d('取消')}</Button>
                            {this.state.editType === 2 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.modifyDBBridge() }}>{intl.get('M26P102261011090100MB002').d('修改')}</Button> :
                                null}
                            {this.state.editType === 1 ?
                                <Button className="ant-btn ant-btn-primary" onClick={(): void => { this.handleDBBridge() }}>{intl.get('COM00100010001').d('确定')}</Button> :
                                null}
                        </div>
                    }
                >
                    <DBBridge editType={this.state.editType} dataInfo={this.state.currentInfo} serverData={this.state.serverData} DBBridge={(data: any): void => this.DBBridgeData(data)} />
                </DraggableModal>
                <DraggableModal
                    visible={this.state.dataBaseVisible}
                    title={intl.get('M26P102261011090100MT004').d('数据库')}
                    width={600}
                    onOk={(): void => { this.handleDataBase() }}
                    onCancel={(): void => { this.setState({ dataBaseVisible: false }) }}
                >
                    <Row style={{ marginTop: '20px' }}>
                        <Col span={5}>{intl.get('M26P102261011090300ML003').d('选择数据库')}</Col>
                        <Col span={19}>
                            <Select value={this.state.databaseValue} onChange={(e): void => { this._handleChangeDataBase(e) }} style={{ width: '100%' }}>
                                {this.state.dataBase.map((item): any => (<Select.Option value={item.DatabaseKey} key={item.DatabaseKey}>{item.Alias}</Select.Option>))}
                            </Select>
                        </Col>
                    </Row>
                </DraggableModal>
            </div>
        )
    }
}


export default DBBridgeContent