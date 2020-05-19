import * as React from 'react'
import { Spin } from 'antd'
import styles from './tabsContent.module.less'

const RecordManage = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/record-manage/recordManage'))
const SiteManage = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/resourceManage/siteManage/siteManage'))
const DBBridge = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/DBBridge'))
const Passageway = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/passageway'))
const ServerConfig = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/serverConfig'))
const Setting = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/setting'))
const DailyCallForm = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/reportForms/dailyCallForm/dailyCallForm'))
const PhoneCallSumForm = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/reportForms/phoneCallSumForm/phoneCallSumForm'))
const BranchCallForm = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/reportForms/branchCallForm/branchCallForm'))
const PlayBackRecordForm = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/reportForms/playBackRecordForm/playBackRecordForm'))
const DownloadRecordForm = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/reportForms/downloadRecordForm/downloadRecordForm'))
const AbnormalInfo = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/query-statistics/abnormal-information/abnormalInfo'))
const SystemAbnormal = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/resource-monitor/system-abnormal/systemAbnormal'))
const Monitoring = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/resource-monitor/monitoring/monitoring'))
const Equipment = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/resource-monitor/equipment/equipment'))
const OperationLog = React.lazy((): Promise<{ default: React.ComponentType<any> }> => import('../../../pages/reportForms/operationLog/operationLog'))

interface IProps {
    tabID: string;
}

class TabsContent extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props)
        this.state = {}
    }

    public renderContent = (id: string): React.ReactElement => {
        switch (id) {
            case '1022610110100000000':
                return <RecordManage />
            case '1022610110901000000':
                return <SiteManage />
            case '1022610110903000000':
                return <DBBridge />
            case '1022610110911000000':
                return <Passageway />
            case '1022610110905000000':
                return <ServerConfig />
            case '1022610110998000000':
                return <Setting />
            case '1022610110501000000':
                return <DailyCallForm />
            case '1022610110502000000':
                return <PhoneCallSumForm />
            case '1022610110505000000':
                return <BranchCallForm />
            case '1022610110511000000':
                return <PlayBackRecordForm />
            case '1022610110512000000':
                return <DownloadRecordForm />
            case '1022610110522000000':
                return <AbnormalInfo />
            case '1022610110305000000':
                return <SystemAbnormal />
            case '1022610110301000000':
                return <Monitoring />
            case '1022610110303000000':
                return <Equipment />
            case '1022610110521000000':
                return <OperationLog />
            default:
                return <div>暂无数据</div>
        }
    }

    public render(): React.ReactElement {
        return (
            <React.Suspense
                fallback={
                    <div className={styles.spinContainer}>
                        <Spin tip="loading..." />
                    </div>
                }
            >
                {
                    this.renderContent(this.props.tabID)
                }
            </React.Suspense>
        )
    }
}


export default TabsContent