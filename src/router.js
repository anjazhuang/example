import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage/IndexPage';
import LoginPage from './routes/LoginPage/LoginPage';
// import buildModuleUrl from "cesium/Source/Core/buildModuleUrl";
// import "cesium/Build/CesiumUnminified/Cesium.js";
// import "cesium/Build/CesiumUnminified/viewerCesiumNavigationMixin.js";
// buildModuleUrl.setBaseUrl('./cesium/');


function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={LoginPage} />
        <Route path="/indexpage" exact component={IndexPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
