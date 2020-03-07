import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import './App.css';
import {
  Link,
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';
import { TasksPage } from './pages/TasksPage';
import { ReportPage } from './pages/ReportPage';

const App: React.FC = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/tasks">Tasks</Link>
          </li>
          <li>
            <Link to="/report">Report</Link>
          </li>
        </ul>
      </nav>
    </div>

    <Switch>
      <Route path="/tasks">
        <TasksPage />
      </Route>
      <Route path="/report">
        <ReportPage />
      </Route>
      <Route path="/">
        <Redirect to={{ pathname: '/tasks' }} />
      </Route>
    </Switch>
  </Router>
);

export default App;

const buttonStyle = css`
  padding: 6px 12px;
  border-radius: 3px;
`;
export const Button: React.FC = () => <button css={buttonStyle}>button</button>;
