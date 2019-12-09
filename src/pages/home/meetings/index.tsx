import React, { useEffect, useState, FormEvent } from 'react';
import { Card, Table, Radio, Divider, Button, Tooltip, Modal, Form, Input, Select, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { IMeetingListItem, ICurrentMeetingState } from '@/models/meeting';
import { RouterTypes, router } from 'umi';
import qs from 'querystring';

interface JoinMeetingFormProps extends FormComponentProps {
  meeting: ICurrentMeetingState;
  onSubmit?: (data: IJoinMeeting) => any;
}

interface ISubmitJoinMeeting {
  name?: string;
  gender?: '0' | '1';
  idCardNumber?: string;
  telephone?: string;
  workspace?: string;
  room?: boolean;
}

interface IJoinMeeting {
  name?: string;
  gender?: number;
  idCardNumber?: string;
  telephone?: string;
  workspace?: string;
  room?: boolean;
  meetingId?: number;
}

const JoinMeetingForm: React.FC<JoinMeetingFormProps> = props => {
  const { validateFields, getFieldDecorator } = props.form;

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    validateFields((err: any, values: ISubmitJoinMeeting) => {
      const data = {
        ...values,
        gender: values.gender ? parseInt(values.gender, 10) : -1,
        meetingId: parseInt(props.meeting.id, 10),
      };

      if (props.onSubmit) {
        props.onSubmit(data);
        props.form.resetFields();
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
      sm: { span: 20 },
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
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Form.Item label="姓名">
        {
          getFieldDecorator('name', {
            rules: [
              {
                required: props.meeting.name,
                message: '请输入姓名',
              },
            ],
          })(<Input type="text" />)
        }
      </Form.Item>
      <Form.Item label="性别">
        {
          getFieldDecorator('gender', {
            rules: [
              {
                required: props.meeting.gender,
                message: '请选择性别',
              },
            ],
          })(
            <Select>
              <Select.Option value="0">男</Select.Option>
              <Select.Option value="1">女</Select.Option>
            </Select>,
          )
        }
      </Form.Item>
      <Form.Item label="身份证号">
        {
          getFieldDecorator('idCardNumber', {
            rules: [
              {
                required: props.meeting.idCardNumber,
                message: '请输入身份证号',
              },
            ],
          })(<Input type="text" />)
        }
      </Form.Item>
      <Form.Item label="电话号码">
        {
          getFieldDecorator('telephone', {
            rules: [
              {
                required: props.meeting.telephone,
                message: '请输入电话号码',
              },
            ],
          })(<Input type="text" />)
        }
      </Form.Item>
      <Form.Item label="工作地点">
        {
          getFieldDecorator('workspace', {
            rules: [
              {
                required: props.meeting.workspace,
                message: '请输入工作地点',
              },
            ],
          })(<Input type="text" />)
        }
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        {
          getFieldDecorator('room', {
            rules: [
              {
                required: props.meeting.room,
              },
            ],
            valuePropName: 'checked',
          })(<Checkbox>我需要安排房间</Checkbox>)
        }
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">确定</Button>
      </Form.Item>
    </Form>
  );
};

const JoinMeeting = Form.create<JoinMeetingFormProps>({ name: 'joinMeeting' })(JoinMeetingForm);

interface MeetingsComponentProps extends RouterTypes {
  page: number;
  type: string;
  query: any;
  dispatch: Dispatch<AnyAction>;
  meetings: IMeetingListItem[];
  total: number;
  loading: boolean;
  role: number;
  userId: number;
  currentMeeting: ICurrentMeetingState;
  getCurrentMeetingLoading: boolean;
  joinModalVisible: boolean;
}

const Meetings: React.FC<MeetingsComponentProps> = props => {
  const [currentSelectedMeeting, setCurrentSelectedMeeting] = useState<string>('0');

  useEffect(() => {
    if (props.dispatch) {
      switch (props.type) {
        case 'all':
          props.dispatch({
            type: 'meeting/getAllMeetings',
            payload: props.page,
          });
          break;
        case 'created':
            props.dispatch({
              type: 'meeting/getCreatedMeetings',
              payload: props.page,
            });
          break;
        case 'joined':
          props.dispatch({
            type: 'meeting/getJoinedMeetings',
            payload: props.page,
          });
          break;
        default:
          break;
      }
    }
  }, [props.location.search]);

  const handleTypeChange = (e: any) => {
    const newQuery = {
      ...props.query,
      page: 1,
      type: e.target.value,
    };
    router.push(`/meetings?${qs.stringify(newQuery)}`);
  };

  const allMeetingColumns = [
    {
      title: '会议名称',
      dataIndex: 'meetingName',
      key: 'meetingName',
    },
    {
      title: '会议城市',
      dataIndex: 'meetingLocation',
      key: 'meetingLocation',
    },
    {
      title: '会议酒店',
      dataIndex: 'hotel',
      key: 'hotel',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '操作',
      render: (record: IMeetingListItem) => (
        <span>
          {
            (record.initiatorId === props.userId || props.role === 0)
            ? <span>
                <Tooltip title="管理该会议">
                  <Button icon="edit" type="primary" />
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="删除该会议">
                  <Button icon="delete" type="danger" />
                </Tooltip>
              </span>
            : <Tooltip title="报名该会议">
                <Button
                  icon="rocket"
                  type="primary"
                  loading={props.getCurrentMeetingLoading && currentSelectedMeeting === record.id}
                  onClick={() => {
                    setCurrentSelectedMeeting(record.id);
                    props.dispatch({
                      type: 'meeting/getCurrentMeeting',
                      payload: record.id,
                    });
                  }}
                />
              </Tooltip>
          }
        </span>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <Card>
        <Radio.Group
          style={{ marginBottom: '8px' }}
          onChange={handleTypeChange}
          value={props.type}
        >
          <Radio.Button value="all">所有会议</Radio.Button>
          <Radio.Button value="created">我创建的</Radio.Button>
          <Radio.Button value="joined">我报名的</Radio.Button>
        </Radio.Group>
        <Table
          rowKey={record => record.id}
          loading={props.loading}
          columns={allMeetingColumns}
          dataSource={props.meetings}
          pagination={{
            defaultCurrent: 1,
            total: props.total,
            current: props.page,
          }}
          onChange={newPage => {
            const newQuery = {
              ...props.query,
              page: newPage.current,
            };
            router.push(`/meetings?${qs.stringify(newQuery)}`);
          }}
        />
      </Card>
      <Modal
          title={`报名会议：${props.currentMeeting.meetingName}`}
          visible={props.joinModalVisible}
          onCancel={() => {
            props.dispatch({
              type: 'meeting/getJoinModalVisible',
              payload: false,
            });
          }}
          footer={null}
        >
          <JoinMeeting
            meeting={props.currentMeeting}
            onSubmit={data => {
              props.dispatch({
                type: 'meeting/attendMeeting',
                payload: data,
              });
            }}
          />
        </Modal>
    </PageHeaderWrapper>
  );
};

export default connect(({ meeting, user, loading }: ConnectState) => ({
  page: meeting.page,
  type: meeting.type,
  query: meeting.query,
  meetings: meeting.meetings,
  total: meeting.total,
  role: user.role,
  userId: user.id,
  loading:
    loading.effects['meeting/getAllMeetings']
    || loading.effects['meeting/getCreatedMeetings']
    || loading.effects['meeting/getJoinedMeetings'],
  currentMeeting: meeting.currentMeeting,
  getCurrentMeetingLoading: loading.effects['meeting/getCurrentMeeting'],
  joinModalVisible: meeting.joinModalVisible,
}))(Meetings);
