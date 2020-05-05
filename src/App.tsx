import * as React from 'react';
import './App.css';
import { config } from 'dotenv';

import { Switch, Route, withRouter, RouteComponentProps, Link } from 'react-router-dom';
import UserList from './components/customer/List';
import Create from './components/customer/Create';
import EditCustomer from './components/customer/Edit';

config();

class App extends React.Component<RouteComponentProps<any>> {
  public render() {
    return (
      <div>
        <nav className="main">
          <ul>
            <li>
              <Link to={'/'}> Customers </Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path={'/'} exact component={UserList} />
          <Route path={'/create'} exact component={Create} />
          <Route path={'/edit/:id'} exact component={EditCustomer} />
        </Switch>
      </div>
    );
  }
}
export default withRouter(App);