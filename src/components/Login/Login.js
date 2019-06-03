import React, { Component } from 'react';
import styles from './Login.less';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button, Icon, Form, Input } from 'antd';

const FormItem = Form.Item;

@Form.create()
class Login extends Component {

  render() {
    const handleOk = () => {
      const { form, dispatch } = this.props;
      const { validateFieldsAndScroll } = form;
      validateFieldsAndScroll((errors, values) => {
        if (errors) {
          return
        }
        // alert(JSON.stringify(values));
        dispatch({ type: 'loginPage/login', payload: values })
      })
    };

    const { form, hidden } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.loginContent}>
        <div className={styles.loginBody + ' ' + (hidden ? styles.hidden : "")}>
          <section className={styles.form}>
            <Form>
              <FormItem hasFeedback>
                {getFieldDecorator('account', {   //getFieldDecorator用于和表单进行双向绑定
                  initialValue: "",
                  rules: [
                    {
                      required: true,
                      message: '请输入账号',
                      type: 'string'
                    }
                  ]
                })(
                  <Input type="text" addonBefore={<Icon type="user"/>} onPressEnter={handleOk}/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码',
                      type: 'string'
                    }
                  ]
                })(
                  <Input type="password" addonBefore={<Icon type="lock"/>} onPressEnter={handleOk}/>
                )}
              </FormItem>
              <Button ghost onClick={handleOk} className={styles.btn}>登录</Button>
              {/*<Button ghost>Default</Button>*/}
            </Form>
          </section>
        </div>
      </div>
    )
  }
}

Login.propTypes = {};

export default connect()(Login);
