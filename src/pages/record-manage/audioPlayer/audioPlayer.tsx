import * as React from 'react'
import moment from 'moment'
import { Button, Slider, Icon } from 'antd'

interface IState {
    totalTime: string;
    currentTime: string;
    process: number;
    speed: number;
    isOpen: boolean;
    drags: boolean;
    /*  begin: any;
     time: number; */
}

let timer: any

class AudioPlayer extends React.Component<any, IState> {
    public audio: any

    public controls: any

    constructor(props: any) {
        super(props)
        this.state = {
            totalTime: '', // 总时长00:00
            currentTime: '00:00', // 当前播放时长00:00
            process: 0, // 当前播放百分比
            speed: 1, // 当前播放速度
            isOpen: true,
            drags: true
            /*  begin: new Date(),
             time: 0 // 总时长 */
        }
        this.audio = React.createRef()
        this.controls = React.createRef()
    }

    public componentDidMount(): void {
        timer = setInterval((): void => {
            this.getCurrentTime()
        }, 1000)
    }

    // public componentDidUpdate(prevProps: any): any {
    //     if (this.props.audiosrc !== prevProps.audiosrc) {
    //         document.querySelectorAll('#audioWrapper')[0].innerHTML = ''
    //         const em = document.createElement('embed')
    //         em.setAttribute('id', 'player')
    //         em.setAttribute('src', this.props.audiosrc)
    //         em.setAttribute('height', '45px')
    //         em.setAttribute('width', '100%')
    //         document.querySelectorAll('#audioWrapper')[0].appendChild(em)
    //     }
    // }

    public componentWillUnmount = async (): Promise<void> => {
        clearInterval(timer)
        this.setState({ isOpen: false })
    }

    // 获取总时长并格式化成00:00
    public getTotalTime = (): string => {
        if (this.audio.current !== null && this.audio.current) {
            const time = this.audio.current.duration
            if (!Number.isNaN(time)) {
                this.setState({
                    drags: false
                })
            }
            const minute = parseInt((time / 60).toString(), 10)
            const second = parseInt((time % 60).toString(), 10)
            return moment({ minute, second }).format('mm:ss')
        }
        return ''
    }

    // 当前播放时长并格式化成00:00
    public getCurrentTime = (): void => {
        const totalTime = this.getTotalTime()
        if (this.audio.current !== null && this.audio.current) {
            const currentTime = this.audio.current.currentTime
            if (typeof this.props.propCurrentTime === 'function') {
                this.props.propCurrentTime(currentTime)
            }
            const duration = this.audio.current.duration
            const minute = parseInt((currentTime / 60).toString(), 10)
            const second = parseInt((currentTime % 60).toString(), 10)
            const process = parseInt(((currentTime / duration) * 100).toString(), 10)

            this.setState({
                totalTime,
                currentTime: moment({ minute, second }).format('mm:ss'),
                process
            })
        }
    }

    // 播放
    public _play = (): void => {
        clearInterval(timer)
        timer = setInterval((): void => {
            this.getCurrentTime()
        }, 1000)

        this.audio.current.play()
    }

    // 暂停
    public _pause = (): void => {
        clearInterval(timer)
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

    public _changeSlow = (): void => {
        const speed = 0.5
        this.audio.current.playbackRate = speed
        this.setState({ speed })
    }

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

    public render(): React.ReactElement {
        const reactStyle = {
            audioContainer: { marginBottom: '5px', position: 'relative' },
            controls: { position: 'relative', height: '10px', marginTop: '5px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '100%' },
            process: { borderRadius: '5px', background: 'green', height: '10px', position: 'absolute', top: 0, left: 0 },
            imgProcess: { background: 'rgb(50,50,50)', opacity: 0.4, position: 'absolute', top: 0, right: 0, height: '100%', width: '100%' }
        }
        return (
            <div style={{ ...reactStyle.audioContainer, ...this.props.style }}>
                {
                    this.props.audioimg !== '/temp/' &&
                    <div style={{ width: '100%', position: 'relative', marginBottom: 5 }}>
                        <div style={{ width: '100%', height: 100, marginTop: '20px' }}>
                            <img style={{ width: '100%', height: '100%' }} src={this.props.audioimg} alt="" />
                        </div>
                        <div style={{ ...reactStyle.imgProcess, ...this.props.style }} />
                    </div>
                }
                {
                    !('ActiveXObject' in window) ?
                        <div key={this.props.audiosrc}>
                            <div style={{ marginTop: '20px' }}>
                                <span>{this.state.currentTime}</span>
                                <span style={{ float: 'right' }}>{this.state.totalTime}</span>
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
                                <Button style={{ width: '45px', height: '45px', marginRight: '5px', padding: '5px', background: '#43515f' }} onClick={this._play} title="播放"><Icon type="play-circle" style={{ fontSize: '30px', color: '#ffffff' }} /></Button>
                                <Button style={{ width: '45px', height: '45px', marginRight: '5px', padding: '5px', background: '#43515f' }} onClick={this._pause} title="暂停"><Icon type="pause-circle" style={{ fontSize: '30px', color: '#ffffff' }} /></Button>
                                <Button style={{ width: '45px', height: '45px', marginRight: '5px', padding: '5px', background: '#43515f' }} onClick={this._changeSlow} title="慢放"><Icon type="fast-backward" style={{ fontSize: '30px', color: '#ffffff' }} /></Button>
                                <Button style={{ width: '45px', height: '45px', marginRight: '5px', padding: '5px', background: '#43515f' }} onClick={this._changeSpeed} title="快放"><Icon type="fast-forward" style={{ fontSize: '30px', color: '#ffffff' }} /></Button>
                                <span style={{ float: 'right' }}>{`X ${this.state.speed}`}</span>
                            </div>
                            <audio
                                id="audio"
                                style={{ width: '100%' }}
                                src={this.state.isOpen && this.props.audiosrc}
                                autoPlay
                                ref={this.audio}
                            >
                                <track kind="captions" />
                            </audio>
                        </div> :
                        <embed key={this.props.audiosrc} ref={this.audio} width="100%" height="45px" src={this.props.audiosrc} />
                    // <div id="audioWrapper" style={{ width: '100%' }}>
                    //     <embed id="player" width="100%" height="45" src={this.props.audiosrc} />
                    // </div>
                }
                {this.props.children}
            </div>
        )
    }
}

export default AudioPlayer