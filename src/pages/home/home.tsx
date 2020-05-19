/* eslint-disable no-tabs */
import * as React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import intl from 'react-intl-universal'
// antd语言设置
import { ConfigProvider, Layout, Tabs, Dropdown, Icon, Menu, message, Typography } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import zhTW from 'antd/es/locale/zh_TW'
import enUS from 'antd/es/locale/en_US'
// moment语言设置
import moment from 'moment'
import 'moment/locale/zh-cn'
import 'moment/locale/zh-tw'
import 'moment/locale/en-gb'
import setLang from '../../redux/actions/langAction'
import setTheme from '../../redux/actions/themeAction'
import { changeTab, deleteTab } from '../../redux/actions/tabsAction'
import DraggableModal from '../../components/cores/draggableModal/draggableModal'
import HeaderRight from '../../components/containers/header-right/headerRight'
import LeftMenu from '../../components/containers/left-menu/leftMenu'
import TabsContent from '../../components/containers/tabs-content/tabsContent'
import { _queryLang, _changeLang, _changeTheme, _userParam, _modules } from '../../common/api/global'
import styles from './home.module.less'

import logo from '../../assets/images/logo.png'
import empImg from '../../assets/images/emp.png'

const { Header, Content, Footer } = Layout
// intl语言包
let locales = {}

interface IProps {
    lang: string; // 语言
    theme: string; // 主题颜色
    tabList: any[]; // tab列表
    activeID: string; // 当前tab
    setLang: (lang: string) => void; // 改变语言
    setTheme: (theme: string) => void; // 改变主题
    changeTab: (data: any) => void; // 改变tab
    deleteTab: (data: any) => void; // 删除tab
}

interface IState {
    visible: boolean;
    initDone: boolean;
    antdLang: any;
    langList: any[];
    modulesList: any[];
}

class Home extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            visible: false,
            initDone: false,
            antdLang: null,
            langList: [],
            modulesList: []
        }
    }

    public componentDidMount(): void {
        this.loadLocalLang()
    }

    public componentWillUnmount(): void {
        locales = {}
    }

    // 加载本地语言包
    public loadLocalLang = async (): Promise<void> => {
        const res: any = await _queryLang()
        if (res && res.result) {
            this.setState({ langList: res.data })
            res.data.forEach((item: any): void => {
                axios.get(`/${item.lang_id}.js`).then((response: any): void => {
                    console.log(response.data)
                    locales[item.culture] = response.data
                    if (Object.keys(locales).length === res.data.length) {
                        this.getUserParam()
                    }
                })
            })
        }
    }

    // 获取用户个人参数
    public getUserParam = async (): Promise<void> => {
        const res: any = await _userParam()
        if (res && res.result) {
            res.data.forEach((item: any): void => {
                if (item.param_id === '903010101') {
                    this.props.setLang(item.value)
                    this.initLanguage(item.value)
                }
                if (item.param_id === '903010102') {
                    switch (item.value) {
                        case 'S1':
                            this.changeTolight()
                            break
                        case 'S2':
                            this.changeToDark()
                            break
                        default:
                            this.changeToDark()
                            break
                    }
                }
            })
        }
    }

    // 初始化语言包
    public initLanguage = (lang: string): void => {
        let currentLocale: string
        // 设置moment,antd语言
        switch (lang) {
            case '2052':
                currentLocale = 'zh-CN'
                moment.locale('zh-cn')
                this.setState({ antdLang: zhCN })
                break
            case '1028':
                currentLocale = 'zh-TW'
                moment.locale('zh-tw')
                this.setState({ antdLang: zhTW })
                break
            case '1033':
                currentLocale = 'en-US'
                moment.locale('en-gb')
                this.setState({ antdLang: enUS })
                break
            default:
                currentLocale = 'en-US'
                moment.locale('en-gb')
                this.setState({ antdLang: enUS })
                break
        }
        // 设置intl语言
        intl.init({
            currentLocale, locales
        }).then((): void => {
            document.getElementsByTagName('title')[0].innerText = intl.get('BDN00013002026')
            this.setState({ initDone: true })
        })
    }

    // 切换语言
    public handleLangChange = (langID: number): void => {
        _changeLang({
            lang_id: langID.toString()
        }).then((res: any): void => {
            if (res && res.result) {
                window.location.reload()
            }
        })
    }

    // 切换主题
    public toggleTheme = (): void => {
        switch (this.props.theme) {
            case 'light':
                _changeTheme({ theme_name: 'S2' })
                this.changeToDark()
                break
            case 'dark':
                _changeTheme({ theme_name: 'S1' })
                this.changeTolight()
                break
            default:
                break
        }
    }

    // 浅色主题
    public changeTolight = (): void => {
        const win: any = window
        win.less.modifyVars({}).then((): void => {
            this.props.setTheme('light')
        }).catch((error: any): void => {
            message.error(error)
        })
    }

    // 深色主题
    public changeToDark = (): void => {
        const blackTheme: any = {
            '@layout-header-background': '#001529',
            '@layout-body-background': '#44515F',
            '@heading-color': 'fade(@white, 85%)',
            '@text-color': 'fade(@white, 65%)',
            '@text-color-secondary': 'fade(@white, 45%)',
            '@table-header-background': '#1d2935',
            '@table-body-background': '#2C3E50',
            '@menu-background': '#2c3e50',
            '@tabs-background': '#273646',
            '@line-color': '#001529'
        }
        const win: any = window
        win.less.modifyVars(blackTheme).then((): void => {
            this.props.setTheme('dark')
        }).catch((error: any): void => {
            message.error(error)
        })
    }

    public onTabsChange = (activeKey: string): void => {
        this.props.changeTab(activeKey)
    }

    public onTabsEdit = (targetKey: any, action: 'add' | 'remove'): void => {
        if (action === 'remove') {
            this.props.deleteTab(targetKey)
        }
    }

    public showEMPNavigation = async (): Promise<void> => {
        const res: any = await _modules()
        if (res && res.data) {
            this.setState({
                modulesList: res.data,
                visible: true
            })
        }
    }

    public render(): React.ReactElement {
        const langMenu = (
            <Menu>
                {
                    this.state.langList.map((item: any): React.ReactElement => (
                        <Menu.Item key={item.lang_id}>
                            {
                                this.props.lang === item.lang_id.toString() &&
                                <Icon type="check" />
                            }
                            <span onClick={this.handleLangChange.bind(this, item.lang_id)}>{item.name}</span>
                        </Menu.Item>
                    ))
                }
            </Menu>
        )

        const getModuleImg = (no: number): any => {
            switch (no) {
                case 11:
                    return empImg
                default:
                    return empImg
            }
        }

        const getTarget = (args: string): string => {
            const type = args.split('?')[1].split('&')[0].split('=')[1]
            switch (type) {
                case '0':
                    return '_top'
                case '1':
                    return '_blank'
                default:
                    return '_blank'
            }
        }

        return (
            <ConfigProvider locale={this.state.antdLang}>
                {
                    this.state.initDone &&
                    <Layout className={styles.layout}>
                        <Header className={styles.header} style={{ color: this.props.theme === 'light' && '#fff' }}>
                            <img src={logo} alt="irecord" onClick={this.showEMPNavigation} />
                            <div className={styles.logoTitle}>{intl.get('BDN00013001026')}</div>
                            <div className={styles.headerRight}>
                                <Dropdown overlay={langMenu} placement="bottomCenter">
                                    <Icon className={styles.icon} type="global" />
                                </Dropdown>
                                <Icon className={styles.icon} type="skin" onClick={this.toggleTheme} />
                                <HeaderRight />
                            </div>
                        </Header>
                        <Content className={styles.main}>
                            <LeftMenu />
                            <Tabs
                                className={styles.tabs}
                                hideAdd
                                type="editable-card"
                                activeKey={this.props.activeID}
                                onChange={this.onTabsChange}
                                onEdit={this.onTabsEdit}
                            >
                                {
                                    this.props.tabList.map((item: any): React.ReactElement => (
                                        <Tabs.TabPane tab={item.name} key={item.id}>
                                            <TabsContent tabID={item.id} />
                                        </Tabs.TabPane>
                                    ))
                                }
                            </Tabs>
                        </Content>
                        <Footer className={`${styles.footer} footer`}>
                            <span style={{ float: 'left' }}>{`${JSON.parse(sessionStorage.getItem('iRecord')).full_name}( ${JSON.parse(sessionStorage.getItem('iRecord')).account} )`}</span>
                            {intl.get('COM10100000010004')}
                        </Footer>

                        <DraggableModal
                            title={intl.get('COM00100000001')}
                            width={500}
                            footer={false}
                            visible={this.state.visible}
                            onCancel={(): void => this.setState({ visible: false })}
                            onOk={(): void => this.setState({ visible: false })}
                        >
                            {
                                this.state.modulesList.map((item: any): React.ReactElement => (
                                    <div key={item.no} className={styles.modulesWrapper}>
                                        <a className={styles.linkWrapper} href={`${item.uri}?Token=${JSON.parse(sessionStorage.getItem('iRecord')).user_token}`} rel="noopener noreferrer" target={getTarget(item.args)}>
                                            <img src={getModuleImg(item.no)} alt={item.name} />
                                            <Typography.Text ellipsis>{item.name}</Typography.Text>
                                        </a>
                                    </div>
                                ))
                            }
                        </DraggableModal>
                    </Layout>
                }
            </ConfigProvider>
        )
    }
}

const mapStateToProps = (state: any): IMapStateToProps => ({
    lang: state.langReducer.lang,
    theme: state.themeReducer.theme,
    tabList: state.IndexTabsReducer.tabList,
    activeID: state.IndexTabsReducer.activeID
})

const mapDispatchToProps = (dispatch: any): any => ({
    setLang: (lang: string): void => dispatch(setLang(lang)),
    setTheme: (theme: string): void => dispatch(setTheme(theme)),
    changeTab: (id: any): void => dispatch(changeTab(id)),
    deleteTab: (id: any): void => dispatch(deleteTab(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)