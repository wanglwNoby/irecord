import * as React from 'react'
import { DatePicker, Checkbox, Input, Row, Col, TreeSelect, message, Tabs } from 'antd'
import intl from 'react-intl-universal'
import moment from 'moment'
import { formatTreeData } from '../../../utils/treeUtil'
import { _extensionTree } from '../../../common/api/recordManage'

function callback(key): void {
    console.log(key)
}

class QueryForm extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            formData: {
                rangeTime: [moment().startOf('day'), moment().endOf('day')], // 自定义时间moment[]
                caller: '', // 主叫号
                called: '', // 被叫号
                call_direction: [], // 呼叫方向
                extension: [], // 分机号
                channel: '', // 通道号
                agent: '', // 坐席
                min_time: '3', // 最小时长
                max_time: '', // 最大时长
                invalidRecords: 1, // 记录有效和无效录音
                meeting: '' //  会议信息
            },
            workerNumberData: [], // 获取分机号
            TreeShowSearch: true // 支持搜索tree
        }
    }

    public componentDidMount(): void {
        this.getExtension()
        this.props.changeFromData(this.state.formData)
    }

    // 获取用户坐席工号数据树菜单
    public getExtension = async (): Promise<void> => {
        const res: any = await _extensionTree()
        if (res && res.result) {
            this.setState({ workerNumberData: formatTreeData(res.data) })
        }
    }

    // 所有input输入框事件
    public handleChangeInput = (type: any, e: any): void => {
        const value = e.target.value
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.changeFromData(this.state.formData) })
    }

    // 判断主叫被叫的格式
    public onblurCaller = (e: any): void => {
        const text = e.target.value // 输入的匹配文本
        const Rep = '^[0-9,]*$' // 输入的正则字符串
        const patt = new RegExp(Rep, 'g')
        const result = patt.test(text) // 显示匹配的字符
        if (!result) {
            message.error(`${intl.get('M26P102261011010000PM016').d('请输入数字,多个用半角逗号隔开')}`)
        }
    }

    // 判断时长大于0的正整数
    public onblurDuration = (value: any): void => {
        if (!/^[0-9]\d*$/.test(value)) {
            message.error(`${intl.get('M26P102261011010000PM010').d('请输入大于0的正整数')}`)
        }
    }

    // 所有通用Form表单下拉框,switch开关,多选checkbox,呼叫方向,rangeDatepicker事件
    public handleChangeOthers = (type: any, value: any): void => {
        console.log(value)
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.changeFromData(this.state.formData) })
    }


    public render(): React.ReactElement {
        const lableSpan = 8
        const contentSpan = 16
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC001').d('基本配置')} key="1">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={lableSpan}>{intl.get('M26P102261011010000ML001').d('查询时间')}</Col>
                            <Col span={contentSpan}>
                                <DatePicker.RangePicker
                                    ranges={{
                                        [intl.get('M26P10226101105120ML001').d('近一天')]: [moment().subtract(1, 'days'), moment()],
                                        [intl.get('M26P10226101105120ML002').d('近一周')]: [moment().subtract(7, 'days'), moment()],
                                        [intl.get('M26P10226101105120ML003').d('近一月')]: [moment().subtract(1, 'months'), moment()]
                                    }}
                                    showTime
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={this.state.formData.rangeTime}
                                    onChange={(dates: any): any => { this.handleChangeOthers('rangeTime', dates) }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>{intl.get('M26P102261011010000ML002').d('时长')}</Col>
                            <Col span={7} style={{ paddingTop: '10px' }}>
                                {/* <span style={{ position: 'absolute', top: '0', right: '-5px' }}>--</span> */}
                                <Input value={this.state.formData.min_time} placeholder={intl.get('M26P102261011010000PM011').d('最小时长')} style={{ color: '#001529' }} addonAfter={intl.get('M26P102261011010000ML003').d('秒')} onBlur={(e: any): void => { this.onblurDuration(e.target.value) }} onChange={(e: any): void => { this.handleChangeInput('min_time', e) }} />
                            </Col>
                            <Col span={2} style={{ textAlign: 'center' }}>--</Col>
                            <Col span={7} style={{ paddingTop: '10px' }}>
                                <Input value={this.state.formData.max_time} placeholder={intl.get('M26P102261011010000PM012').d('最大时长')} style={{ color: '#001529' }} addonAfter={intl.get('M26P102261011010000ML003').d('秒')} onBlur={(e: any): void => { this.onblurDuration(e.target.value) }} onChange={(e: any): void => { this.handleChangeInput('max_time', e) }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={lableSpan}>
                                {intl.get('VP9122611110100000005').d('呼叫方向')}
                            </Col>
                            <Col span={contentSpan}>
                                <Checkbox.Group value={this.state.formData.call_direction} onChange={(e): void => { this.handleChangeOthers('call_direction', e) }}>
                                    <Checkbox value="73">{intl.get('COM001007001V73').d('呼入')}</Checkbox>
                                    <Checkbox value="79">{intl.get('COM001007001V79').d('呼出')}</Checkbox>
                                </Checkbox.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={lableSpan}>
                                {intl.get('M26P102261011010000ML004').d('录音类别')}
                            </Col>
                            <Col span={contentSpan}>
                                <Checkbox.Group onChange={(e): void => { this.handleChangeOthers('invalidRecords', e) }}>
                                    <Checkbox value={0}>{intl.get('M26P102261011010000ML005').d('无效录音')}</Checkbox>
                                </Checkbox.Group>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={intl.get('M26P102261011010000MC001').d('高级查询')} key="2">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={8}>{intl.get('M26P102261011010000ML006').d('分机')}</Col>
                            <Col span={16}>
                                <TreeSelect
                                    treeData={this.state.workerNumberData}
                                    value={this.state.formData.extension}
                                    maxTagCount={3}
                                    onChange={(value: string[]): any => { this.handleChangeOthers('extension', value) }}
                                    treeCheckable="true"
                                    showSearch={this.state.TreeShowSearch}
                                    multiple={this.state.TreeShowSearch}
                                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                                    searchPlaceholder={intl.get('M26P102261011010000PM013').d('请选择分机')}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={lableSpan}>{intl.get('M26P102261011010000ML007').d('坐席')}</Col>
                            <Col span={contentSpan}>
                                <Input placeholder={intl.get('M26P102261011010000PM016').d('请输入数字,多个用半角逗号隔开')} value={this.state.formData.agent} onBlur={(e: any): void => { this.onblurCaller(e) }} onChange={(e: any): void => { this.handleChangeInput('agent', e) }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={lableSpan}>{intl.get('M26P102261011091100ML008').d('通道名')}</Col>
                            <Col span={contentSpan}>
                                <Input placeholder={intl.get('M26P102261011010000PM015').d('请输入通道名')} value={this.state.formData.channel} onChange={(e: any): void => { this.handleChangeInput('channel', e) }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={lableSpan}>{intl.get('VP9122636110100000007').d('主叫号码')}</Col>
                            <Col span={contentSpan}>
                                <Input placeholder={intl.get('M26P102261011010000PM016').d('请输入数字,多个用半角逗号隔开')} value={this.state.formData.caller} onBlur={(e: any): void => { this.onblurCaller(e) }} onChange={(e: any): void => { this.handleChangeInput('caller', e) }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={lableSpan}>{intl.get('VP9122636110100000008').d('被叫号码')}</Col>
                            <Col span={contentSpan}>
                                <Input placeholder={intl.get('M26P102261011010000PM016').d('请输入数字,多个用半角逗号隔开')} value={this.state.formData.called} onBlur={(e: any): void => { this.onblurCaller(e) }} onChange={(e: any): void => { this.handleChangeInput('called', e) }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={lableSpan}>{intl.get('M26P102261011010000ML017').d('会议信息')}</Col>
                            <Col span={contentSpan}>
                                <Input placeholder={intl.get('M26P102261011010000PM014').d('请输入会议信息')} value={this.state.formData.meeting} onChange={(e: any): void => { this.handleChangeInput('meeting', e) }} />
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        )
    }
}

export default QueryForm