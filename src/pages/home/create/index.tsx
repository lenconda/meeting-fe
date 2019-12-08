import React, { FormEvent } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { Form, Card, Input, DatePicker, Cascader, Checkbox, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import router from 'umi/router';
import cities from '@/assets/cities.json';
import { Moment } from 'moment';

const { RangePicker } = DatePicker;

interface CreateMeetingComponentProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  submitting: boolean;
}

interface ISubmitInformation {
  meetingName: string;
  meetingLocation: string[];
  hotel: string;
  time: Moment[];
  name: boolean;
  idCardNumber: boolean;
  workspace: boolean;
  telephone: boolean;
  gender: boolean;
  room: boolean;
}

const CreateMeetingForm: React.FC<CreateMeetingComponentProps> = props => {
  const { getFieldDecorator, validateFields } = props.form;

  const handleSubmit = (e: FormEvent): void => {
    const { dispatch } = props;

    e.preventDefault();

    validateFields((err: any, values: ISubmitInformation) => {
      const {
        meetingName,
        hotel,
        name,
        idCardNumber,
        workspace,
        telephone,
        gender,
        room,
      } = values;
      const startTime = values.time[0].format('YYYY-MM-DD HH:mm');
      const endTime = values.time[1].format('YYYY-MM-DD HH:mm');

      const meetingLocation = values.meetingLocation.filter((value, index) => !((value === '市辖区' || value === '县') && (index === 1))).join('');

      const data = {
        meetingName,
        hotel,
        startTime,
        endTime,
        meetingLocation,
        name,
        idCardNumber,
        workspace,
        telephone,
        gender,
        room,
      };

      if (dispatch) {
        dispatch({
          type: 'meeting/createMeeting',
          payload: data,
        });
      }
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 8,
        offset: 4,
      },
    },
  };

  return (
    <PageHeaderWrapper>
      <Card>
        <Form onSubmit={handleSubmit} {...formItemLayout}>
          <Form.Item label="会议名称">
            {
              getFieldDecorator('meetingName', {
                rules: [
                  {
                    required: true,
                    message: '请输入会议名称',
                  },
                ],
              })(
                <Input type="text" />,
              )
            }
          </Form.Item>
          <Form.Item label="与会酒店">
            {
              getFieldDecorator('hotel', {
                rules: [
                  {
                    required: true,
                    message: '请输入酒店名称',
                  },
                ],
              })(
                <Input type="text" />,
              )
            }
          </Form.Item>
          <Form.Item label="会议城市">
            {
              getFieldDecorator('meetingLocation', {
                rules: [
                  {
                    required: true,
                    message: '请选择会议城市',
                  },
                ],
              })(
                <Cascader options={cities} />,
              )
            }
          </Form.Item>
          <Form.Item label="会议起迄时间">
            {
              getFieldDecorator('time', {
                rules: [
                  {
                    required: true,
                    message: '请选择会议起迄时间',
                  },
                ],
              })(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />,
              )
            }
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            {
              getFieldDecorator('name', {
                valuePropName: 'checked',
                initialValue: false,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(
                <Checkbox>需要参会者姓名</Checkbox>,
              )
            }
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            {
              getFieldDecorator('idCardNumber', {
                valuePropName: 'checked',
                initialValue: false,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(
                <Checkbox>需要参会者身份证号</Checkbox>,
              )
            }
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            {
              getFieldDecorator('workspace', {
                valuePropName: 'checked',
                initialValue: false,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(
                <Checkbox>需要参会者工作地点</Checkbox>,
              )
            }
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            {
              getFieldDecorator('telephone', {
                valuePropName: 'checked',
                initialValue: false,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(
                <Checkbox>需要参会者电话号码</Checkbox>,
              )
            }
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            {
              getFieldDecorator('gender', {
                valuePropName: 'checked',
                initialValue: false,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(
                <Checkbox>需要参会者性别</Checkbox>,
              )
            }
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            {
              getFieldDecorator('room', {
                valuePropName: 'checked',
                initialValue: false,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(
                <Checkbox>需要参会者选择是否安排房间</Checkbox>,
              )
            }
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>保存修改</Button>
            <Button type="ghost" onClick={() => router.goBack()}>取消</Button>
          </Form.Item>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};

const CreateMeeting = Form.create({ name: 'createMeetingForm' })(
  connect(({ loading }: ConnectState) => ({
    submitting: loading.effects['meeting/createMeeting'],
  }))(CreateMeetingForm),
);

export default CreateMeeting;
