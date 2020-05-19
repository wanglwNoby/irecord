import * as React from 'react'
import { Row, Col, Input, Icon, Button, Table, message, Slider } from 'antd'
import intl from 'react-intl-universal'
import moment from 'moment'
import { _mark } from '../../../common/api/recordManage'
import styles from './MakeSign.module.less'
// import AudioPlayer from '@/common_components/audio-player';

/* import WithLangs from "@/core/WithLangs";
import SelectTheme from '@/core/WithTheme';
import grey from './css/grey.module.less';
import lightBlue from './css/lightBlue.module.less';
import purpleBlack from './css/purpleBlack.module.less';
import darkBlue from './css/darkBlue.module.less';
import darkBlack from './css/darkBlack.module.less'; */

/* const { TextArea } = Input;
const Option = Select.Option;
let style = SelectTheme({ grey, lightBlue, purpleBlack, darkBlue, darkBlack }); */
class MakeSign extends React.Component<any, any> {
    public audio: any

    public canvas: any

    public timer: any

    public controls: any

    constructor(props) {
        super(props)
        this.state = {
            totalTime: '', // 总时长00:00
            currentTime: '00:00', // 当前播放时长00:00
            process: 0, // 当前播放百分比
            speed: 1, // 当前播放速度
            columns: [ // table表头
                {
                    title: `${intl.get('M26P102261011010000ML014').d('标题')}`,
                    dataIndex: 'title'
                }, {
                    title: `${intl.get('M26P102261011010000ML016').d('开始位置')}`,
                    dataIndex: 'offsettime',
                    render: (text): string => this.formatTime(text)
                }, {
                    title: `${intl.get('M26P102261011010000ML002').d('时长')}`,
                    dataIndex: 'offsetlength',
                    render: (text): string => this.formatTime(text)
                }
            ],
            tableData: [], // 标记数据列表
            /*  keywordGroup: [], */ // 关键词数据集合
            keywords_color: '', // 关键词组颜色
            offsetTime: 0, // 画线的起点时间（秒）
            timeLength: 0, // 画线的总时长(秒)
            /* keywords: [], */ // 当前选中关键词组的关键词列表
            content: '', // 标记标题
            content_remark: '', // 标记内容
            /* keyword_group_id: '', // 当前选择的关键词组id
            keyword_id: '', */ // 当前选择的关键词id
            /* tagging_person: '', // 标注人
            tagging_time: '', */ // 标注时间
            rowId: '', // 当前选择的标注内容id
            signEndTime: 10000, // 当前标记录音结束时间点（秒）
            createTime: '', // 标记创建时间
            addModal: true, // 控制添加
            onClickTable: false,
            oldoffsetTime: '' // 记录上一次时长
        }
        this.audio = React.createRef()
        this.canvas = React.createRef()
        this.timer = 0
    }

    public componentDidMount(): void {
        console.log(this.props.media_id)
        /* this.getKeywords() */
        this.audio.current.addEventListener('loadeddata', (): void => {
            console.log('加载成功')
            // 展示所有划线标记
            this.getSignData().then((res: any): any => {
                console.log(res)
                if (res.data !== 'null') {
                    const data = JSON.parse(res.data)
                    data.forEach((item): void => {
                        console.log(this.audio)
                        const beginPoint = Number(item.offsettime) / this.audio.current.duration * 1052
                        const endPoint = (Number(item.offsettime) + Number(item.offsetlength)) / this.audio.current.duration * 1052
                        console.log(beginPoint, endPoint)
                        const oc = this.canvas.current
                        const ogc = oc.getContext('2d')
                        // 根据数据返回确定划线颜色
                        /*  const lineColor = this.state.keywordGroup.filter((wordsGroup): boolean => wordsGroup.group_id === item.keyword_group_id)[0].color
                         ogc.strokeStyle = lineColor */
                        ogc.strokeStyle = '#ffffff'
                        ogc.beginPath()
                        ogc.moveTo(beginPoint, 40)
                        ogc.lineTo(endPoint, 40)
                        ogc.stroke()
                    })
                }
            })
            this.getTotalTime()
            this.timer = setInterval((): void => {
                this.getCurrentTime()
                // 如果当前播放时间 === 双击播放划线录音得结束时间,就停止
                const currentTime = parseInt(this.audio.current.currentTime, 10)
                if (currentTime === this.state.signEndTime) {
                    this.audio.current.pause()
                }
            }, 1000)
            // 设置画线方法
            const oc = this.canvas.current
            const ogc = oc.getContext('2d')
            const time = this.audio.current.duration
            oc.onmousedown = (ev: any): void => {
                ev.stopPropagation()
                ogc.beginPath()
                ogc.clearRect(0, 0, 1052, 105)
                const evs = window.event || ev
                ogc.moveTo(evs.offsetX - oc.offsetLeft, evs.offsetY - oc.offsetTop)
                // 计算划线起点时间
                const offsetTime = parseInt((ev.offsetX / 1052 * time).toString(), 10)
                /* const offsetTime = Math.floor(ev.offsetX / 1052 * time * 1000) / 1000 */
                console.log('offsetTime', offsetTime)
                document.onmousemove = (evc: any): void => {
                    const evcs = evc || window.event
                    ogc.lineTo(evcs.offsetX - oc.offsetLeft, evs.offsetY - oc.offsetTop)
                    ogc.strokeStyle = '#ffffff'
                    ogc.stroke()
                    ogc.strokeStyle = this.state.keywords_color
                    // 计算划线终点时间减去起点时间算划线总时长(s)
                    const timeLength = parseInt((evcs.offsetX / 1052 * time).toString(), 10) - offsetTime
                    /* const timeLength = (Math.floor(evcs.offsetX / 1052 * time * 1000) / 1000) - Math.floor(offsetTime * 1000) / 1000 */
                    this.setState({
                        offsetTime,
                        timeLength
                    })
                }
                document.onmouseup = (): void => {
                    document.onmousemove = null
                    document.onmouseup = null
                }
            }
        })
    }

    public componentWillUnmount(): void {
        clearInterval(this.timer)
    }

    // 获取录音标记数据
    public getSignData = async (): Promise<void> => {
        const res: any = await _mark({
            record_id: this.props.media_id,
            type: 2,
            operation_type: 3
        })
        console.log(res)
        if (res.result && res.data !== 'null') {
            const data = JSON.parse(res.data)
            if (data.length === 0) {
                this.setState({
                    addModal: true
                })
            }
            data.forEach((item: any): void => {
                item.key = Math.random()
            })
            this.setState({ tableData: data })
            return res
        }
        return res
    }

    // 获取关键词数据
    /* public getKeywords = async (): Promise<void> => {
        const res: any = await _selectKeywordsKeyterm()
        if (res.result) {
            this.setState({ keywordGroup: res.data })
        } else {
            message.error(res.msg)
        }
    } */

    // 格式化时间(秒->00:00)
    public formatTime = (time): string => {
        const minute = parseInt((time / 60).toString(), 10)
        const second = parseInt((time % 60).toString(), 10)
        /* const millisecond = 1000 * Number((time % 1).toFixed(2))
         return moment({ minute, second, millisecond }).format('mm:ss.ms') */
        return moment({ minute, second }).format('mm:ss')
    }

    // 获取总时长并格式化成00:00
    public getTotalTime = (): void => {
        const time = this.audio.current.duration
        const minute = parseInt((time / 60).toString(), 10)
        const second = parseInt((time % 60).toString(), 10)
        /* const millisecond = 1000 * Number((time % 1).toFixed(2)) */
        this.setState({ totalTime: moment({ minute, second }).format('mm:ss') })
    }

    // 当前播放时长并格式化成00:00
    public getCurrentTime = (): void => {
        /* const currentTime = this.audio.current.currentTime
        const duration = this.audio.current.duration
        const minute = parseInt((currentTime / 60).toString(), 10)
        const second = parseInt((currentTime % 60).toString(), 10)
        const millisecond = 1000 * Number((currentTime % 1).toFixed(2))
        const process = (currentTime / duration) * 100
        this.setState({ currentTime: moment({ minute, second }).format('mm:ss'), process }) */
        if (this.audio.current !== null && this.audio.current) {
            const currentTime = this.audio.current.currentTime
            const duration = this.audio.current.duration
            const minute = parseInt((currentTime / 60).toString(), 10)
            const second = parseInt((currentTime % 60).toString(), 10)
            const process = parseInt(((currentTime / duration) * 100).toString(), 10)
            this.setState({
                currentTime: moment({ minute, second }).format('mm:ss'),
                process
            })
        }
    }

    // 播放
    public _play = (): void => {
        this.audio.current.currentTime += 1
        this.audio.current.play()
    }

    // 暂停
    public _pause = (): void => {
        this.audio.current.pause()
    }

    // 切换播放倍速 0.5 1 1.5 2
    public _changeSpeed = (): void => {
        const playbackSpeed = (value): number => {
            if (value === 2) {
                const speed = 1
                this.audio.current.playbackRate = speed
                return speed
            }
            const speed = value + 0.5
            this.audio.current.playbackRate = speed
            return speed
        }
        this.setState((prevState): any => ({
            speed: playbackSpeed(prevState.speed)
        }))
    }

    // 进度条快进
    /* public _changeProcess = (e): void => {
        const time = this.audio.current.duration
        const clientWidth = this.controls.current.clientWidth
        const es = window.event || e
        const currentTime = Number(((es.offsetX / clientWidth) * time).toFixed(2))
        this.audio.current.currentTime = currentTime
    } */

    // 进度条快进，通过Slider的值，设置播放位置，并播放
    public _changeProcess = (value): void => {
        const auidoDom = this.audio.current
        const totalTime = auidoDom.duration
        const currentTime = parseInt(((totalTime * value) / 100).toString(), 10)
        // 是否支持 fastSeek 方法
        if ('faseSeek' in auidoDom) {
            auidoDom.fastSeek(currentTime)
        } else {
            auidoDom.currentTime = currentTime
            if (this.audio.current.paused) {
                this._play()
            }
        }
    }

    // 改变 Slider ，触发。
    // 修改进度和时间
    public ChangeSlider = (value): void => {
        if (!this.audio.current.paused) {
            this._pause()
        }
        const auidoDom = this.audio.current
        const time = auidoDom.duration
        const currentTime = parseInt(((time * value) / 100).toString(), 10)
        const minute = parseInt((currentTime / 60).toString(), 10)
        const second = parseInt((currentTime % 60).toString(), 10)
        this.setState({
            process: value,
            currentTime: moment({ minute, second }).format('mm:ss')
        })
    }

    // 拖拽后，mouseup ，触发，获取当前时间，然后设置 audio 的播放
    public afterChangeSlider = (): void => {
        this._changeProcess(this.state.process)
    }

    // 标题
    public _handleChangeInput = (e): void => {
        this.setState({ content: e.target.value })
    }

    // 标记内容
    public _handleChangeContent = (e): void => {
        this.setState({ content_remark: e.target.value })
    }


    // 列表点击事件
    public onClickRow = (record: any): any => ({
        onClick: (): void => { // 展示当前选择标记内容的划线标记和详情
            this.setState((prevState): any => ({
                onClickTable: !prevState.onClickTable
            }))
            if (this.state.onClickTable) {
                console.log(record)
                const begin = parseInt((Number(record.offsettime) / this.audio.current.duration * 1052).toString(), 10)
                const end = parseInt(((Number(record.offsettime) + Number(record.offsetlength)) / this.audio.current.duration * 1052).toString(), 10)
                const oc = this.canvas.current
                const ogc = oc.getContext('2d')
                /* ogc.strokeStyle = group.color */
                ogc.beginPath()
                ogc.clearRect(0, 0, 1052, 105)
                ogc.moveTo(begin, 30)
                ogc.lineTo(end, 30)
                ogc.stroke()
                this.setState({
                    rowId: record.createtime,
                    content: record.title,
                    content_remark: record.content,
                    offsetTime: record.offsettime,
                    oldoffsetTime: record.offsettime,
                    timeLength: record.offsetlength,
                    createTime: record.createtime,
                    addModal: false
                })
            } else {
                const oc = this.canvas.current
                const ogc = oc.getContext('2d')
                ogc.clearRect(0, 0, 1052, 105)
                this.setState({
                    rowId: '',
                    content: '',
                    content_remark: '',
                    offsetTime: 0,
                    timeLength: 0,
                    createTime: '',
                    addModal: true
                })
            }
        },
        onDoubleClick: (): void => { // 显示当前画线，并播放改段录音
            this.audio.current.currentTime = Number(record.offsettime)
            const signEndTime = parseInt((Number(record.offsetlength) + Number(record.offsettime)).toString(), 10)
            this.setState({ signEndTime })
        }
    })

    public setRowClassName = (record): string => {
        console.log(record)
        return record.createtime === this.state.rowId ? 'clickRow' : ''
    }

    // 添加标记
    public _handleAddSign = async (): Promise<void> => {
        if (this.state.content !== '' && this.state.offsetTime1 !== 0 && this.state.timeLength !== 0) {
            const res: any = await _mark({
                type: 2,
                record_id: this.props.media_id || '',
                offset_time: this.state.offsetTime,
                offset_length: this.state.timeLength,
                title: this.state.content,
                content: this.state.content_remark,
                operation_type: 1
            })
            if (res.result) {
                message.success(`${intl.get('M26P102261011010000PM007').d('添加成功')}`)
                const cxt = this.canvas.current.getContext('2d')
                cxt.clearRect(0, 0, 1052, 105)
                this.setState({
                    content: '',
                    content_remark: ''
                })
                this.getSignData()
            } else {
                message.error(res.msg)
            }
        }
        message.warning(`${intl.get('M26P102261011010000PM018').d('起始标记点不能重复，且标题或标注不能为空')}`)
    }

    // 删除标记
    public _handleDeleteSign = async (): Promise<void> => {
        if (this.state.offsetTime !== 0) {
            const res: any = await _mark({
                type: 2,
                record_id: this.props.media_id || '',
                offset_time: this.state.offsetTime,
                operation_type: 0
            })
            if (res.result) {
                message.success(`${intl.get('COM00100010008').d('操作成功')}`)
                this.getSignData()
                const oc = this.canvas.current
                const ogc = oc.getContext('2d')
                ogc.clearRect(0, 0, 1052, 105)
                this.setState({
                    content: '',
                    content_remark: ''
                })
            } else {
                message.error(res.msg)
            }
        }
        message.warning(`${intl.get('M26P102261011010000PM019').d('请选择要删除的数据')}`)
    }

    // 更新标记
    public _handleUpdateSign = async (): Promise<void> => {
        if (this.state.content !== '') {
            const res: any = await _mark({
                type: 2,
                record_id: this.props.media_id || '',
                create_time: this.state.createTime,
                offset_time: this.state.offsetTime,
                oldoffset_time: this.state.oldoffsetTime,
                offset_length: this.state.timeLength,
                title: this.state.content,
                content: this.state.content_remark,
                operation_type: 2
            })
            if (res.result) {
                message.success(`${intl.get('COM00100010008').d('操作成功')}`)
                this.getSignData()
            } else {
                message.error(res.msg)
            }
        }
        message.warning(`${intl.get('M26P102261011010000PM020').d('标题不能为空')}`)
    }

    public render(): React.ReactElement {
        const rowStyle = { margin: '8px 8px 0px 8px' }
        const lableSpan = 5
        const contentSpan = 17
        return (
            <div className={styles.columns}>
                <div>
                    <div style={{ width: '100%', position: 'relative', marginBottom: 5 }}>
                        <div style={{ width: '100%', height: 100 }}>
                            <img style={{ width: '100%', height: 100 }} src={this.props.audioimg} alt="" />
                        </div>
                        <div style={{ width: (100 - this.state.process) || '%' }} />
                        <canvas width="1052" height="105" style={{ position: 'absolute', top: '0', left: '0' }} ref={this.canvas} />
                    </div>
                    <div>
                        <span>{this.state.currentTime}</span>
                        <span style={{ float: 'right' }}>{this.state.totalTime}</span>
                    </div>
                    <div onClick={this._changeProcess} ref={this.controls}>
                        <div style={{ width: this.state.process || '%' }} />
                    </div>
                    <div onMouseDown={this._pause} onMouseUp={this._play}>
                        <Slider
                            tipFormatter={(): any => (this.state.currentTime)}
                            onChange={this.ChangeSlider}
                            onAfterChange={this.afterChangeSlider}
                            defaultValue={0}
                            value={this.state.process}
                            disabled={this.state.drags}
                        />
                    </div>
                    <div>
                        <Button style={{ background: '#2c3e50' }} onClick={this._play} title={intl.get('M26P102261011010000MB002').d('播放')}><Icon type="play-circle" style={{ color: '#ffffff' }} /></Button>
                        <Button style={{ background: '#2c3e50' }} onClick={this._pause} title={intl.get('M26P102261011010000MB003').d('暂停')}>
                            <Icon type="pause-circle" style={{ color: '#ffffff' }} />
                        </Button>
                        <Button style={{ background: '#2c3e50' }} onClick={this._changeSpeed} title={intl.get('M26P102261011010000MB004').d('倍速')}><Icon type="forward" style={{ color: '#ffffff' }} /></Button>
                        <span style={{ float: 'right' }}>{`X ${this.state.speed}`}</span>
                    </div>
                    <audio
                        style={{ width: '100%' }}
                        src={this.props.audiosrc}
                        autoPlay
                        ref={this.audio}
                    >
                        <track kind="captions" />
                    </audio>
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ width: '45%', float: 'left', border: '1px solid #e8e7e8', marginTop: '5px' }}>
                        <Row style={rowStyle}>
                            <Col span={lableSpan}>{intl.get('M26P102261011010000ML014').d('标题')}</Col>
                            <Col span={contentSpan}>
                                <Input onChange={this._handleChangeInput} value={this.state.content} />
                            </Col>
                        </Row>
                        <Row style={rowStyle}>
                            <Col span={lableSpan}>{intl.get('M26P102261011010000ML015').d('内容')}</Col>
                            <Col span={contentSpan}>
                                <Input.TextArea
                                    rows={3}
                                    value={this.state.content_remark}
                                    onChange={this._handleChangeContent}
                                />
                            </Col>
                        </Row>
                        <Row style={rowStyle}>
                            <Col span={lableSpan} />
                            <Col span={contentSpan}>
                                {this.state.addModal && <Button onClick={this._handleAddSign} title={intl.get('M26P102261011010000MB001').d('添加')}><Icon type="plus-circle" /></Button>}
                                <Button onClick={this._handleUpdateSign} title={intl.get('M26P102261011090100MB002').d('修改')}><Icon type="edit" /></Button>
                                <Button onClick={this._handleDeleteSign} title={intl.get('VP9122636110100000011').d('删除')}><Icon type="minus-circle" /></Button>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ marginTop: '5px', width: '49%', float: 'left', marginLeft: '4%' }}>
                        <Table
                            scroll={{ y: 150 }}
                            size="small"
                            columns={this.state.columns}
                            dataSource={this.state.tableData}
                            onRow={this.onClickRow}
                            rowClassName={this.setRowClassName}
                            pagination={false}
                        />
                    </div>
                </div>
                {/*  <div>
                    <Button onClick={this._handleAddSign} title={intl.get('M26P102261011010000MB001').d('添加')}><Icon type="plus-circle" /></Button>
                    <Button onClick={this._handleUpdateSign} title={intl.get('M26P102261011090100MB002').d('修改')}><Icon type="edit" /></Button>
                    <Button onClick={this._handleDeleteSign} title={intl.get('VP9122636110100000011').d('删除')}><Icon type="minus-circle" /></Button>
                </div> */}
            </div>
        )
    }
}

export default MakeSign