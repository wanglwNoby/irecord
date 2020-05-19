import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { _check } from '../common/api/global'

const PrivateRoute = ({ component: Component, ...rest }): any => {
    // 是否为其它系统跳转过来的
    if (window.location.href.split('?')[1] && window.location.href.split('?')[1].split('=')[0] === 'Token') {
        const token = window.location.href.split('?')[1].split('=')[1]
        _check({ params: { token } }).then((res: any): any => {
            if (res && res.result) {
                sessionStorage.setItem('iRecord', JSON.stringify(res.data))
                window.location.href = '/'
            }
        })
    } else {
        const iRecord = sessionStorage.getItem('iRecord')
        return (
            <Route
                {...rest}
                render={(props: any): React.ReactElement => (
                    iRecord ?
                        <Component {...props} /> :
                        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )}
            />
        )
    }
    return null
}

export default PrivateRoute