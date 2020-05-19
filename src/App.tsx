import * as React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { message } from 'antd'
import PrivateRoute from './utils/privateRoute'
import reducer from './redux/index'
import Home from './pages/home/home'
import Login from './pages/login/login'
import './App.less'

const store = createStore(reducer)

class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {}
    }

    public componentDidMount(): void {
        // 全局配置antd-message
        message.config({
            top: 250,
            duration: 2,
            maxCount: 1
        })
    }

    public render(): any {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/login" component={Login} />
                        <PrivateRoute path="/" component={Home} />
                        <Redirect to="/" />
                    </Switch>
                </BrowserRouter>
            </Provider>
        )
    }
}

export default App