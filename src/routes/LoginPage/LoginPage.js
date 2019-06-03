import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types'
import Login from '../../components/Login/Login';


class LoginPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {}
  };

  render() {
    const { loginPage } = this.props;
    console.log(loginPage);
    // const { percent, percentname,progresshidden,loginhidden} = loginPage;
    return (
      <div>
        <Login />
      </div>
    );
  };
}

export default connect(({ loginPage }) => ({
  loginPage
}))(LoginPage);

LoginPage.propTypes = {
  loginPage: PropTypes.object
};

