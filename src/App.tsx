import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import './App.css';
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';
import { TasksPage } from './pages/TasksPage';
import { ReportPage } from './pages/ReportPage';
import {
  Navigation,
  NAVIGATION_HEIGHT
} from 'components/presentation/Navigation';

const App: React.FC = () => (
  <Router>
    <Navigation />

    <div
      css={css`
        display: flex;
        justify-content: center;
      `}
    >
      <div
        css={css`
          margin-top: ${NAVIGATION_HEIGHT + 8}px;
          max-width: 700px;
          width: 100%;
        `}
      >
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
      </div>
    </div>
  </Router>
);

export default App;
