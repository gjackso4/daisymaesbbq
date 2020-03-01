import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import Admin from './Admin';
import NotFound from './NotFound';
import Success from './Success';
import PaymentError from './PaymentError';


const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={App} />
            <Route exact path="/inventory" component={Admin} />
            <Route exact path="/success" component={Success} />
            <Route exact path="/error" component={PaymentError} />
            <Route component={NotFound} />
        </Switch>
    </BrowserRouter>
)

export default Router;
