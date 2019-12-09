import React, { useState, useEffect } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { Card, Button, Descriptions, Table, Tooltip, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import {
  ICurrentMeetingState,
  IParticipantsState,
} from '@/models/meeting';

interface ManageMeetingComponentProps {
  dispatch: Dispatch<AnyAction>;
  manageMeetingLoading: boolean;
  currentMeeting: ICurrentMeetingState;
  participants: IParticipantsState[];
  userId: number;
  checkInLoading: boolean;
}

const ManageMeeting: React.FC<ManageMeetingComponentProps> = props => {
  const [currentRecordId, setCurrentRecordId] = useState<number>(0);

  useEffect(() => {
    props.dispatch({
      type: 'meeting/getManageMeeting',
      payload: window.location.search,
    });
  }, []);

  const handleCheckInConfirm = (participantId: number) => {
    props.dispatch({
      type: 'meeting/checkIn',
      payload: {
        participantId,
        meetingId: parseInt(props.currentMeeting.id, 10),
      },
    });
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      index: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      index: 'gender',
      render: ((text: number) => (
        <span>{text === 0 ? '男' : '女'}</span>
      )),
    },
    {
      title: '电话',
      dataIndex: 'phone',
      index: 'phone',
    },
    {
      title: '身份证号',
      dataIndex: 'idCardNumber',
      index: 'idCardNumber',
    },
    {
      title: '工作地点',
      dataIndex: 'workspace',
      index: 'workspace',
    },
    {
      title: '是否需要房间',
      dataIndex: 'room',
      index: 'room',
      render: ((text: boolean) => (
        text !== null
        ? <span>
            {
              text ? '是' : '否'
            }
          </span>
        : null
      )),
    },
    {
      title: '签到情况',
      dataIndex: 'checkInTime',
      index: 'checkInTime',
    },
    {
      title: '操作',
      render: ((record: IParticipantsState) => (
        <span>
          <Popconfirm
            title="确定签到吗？"
            onConfirm={() => {
              if (Date.parse(new Date(props.currentMeeting.endTime).toString()) - Date.now() > 0) {
                handleCheckInConfirm(record.id);
              }
            }}
          >
            <Tooltip title="签到">
              <Button
                icon="check-square"
                type="primary"
                loading={props.checkInLoading && currentRecordId === record.id}
                onClick={() => setCurrentRecordId(record.id)}
                disabled={
                  Date.parse(new Date(props.currentMeeting.endTime).toString()) - Date.now() <= 0
                }
              />
            </Tooltip>
          </Popconfirm>
        </span>
      )),
    },
  ];

  return (
    <PageHeaderWrapper>
      <Card loading={props.manageMeetingLoading}>
        <Descriptions bordered>
          <Descriptions.Item label="会议名称">{props.currentMeeting.meetingName}</Descriptions.Item>
          <Descriptions.Item label="会议地区">{props.currentMeeting.meetingLocation}</Descriptions.Item>
          <Descriptions.Item label="与会酒店">{props.currentMeeting.hotel}</Descriptions.Item>
          <Descriptions.Item label="开始时间">{props.currentMeeting.startTime}</Descriptions.Item>
          <Descriptions.Item label="结束时间" span={2}>
            {props.currentMeeting.endTime}
          </Descriptions.Item>
        </Descriptions>
        <Button
          style={{ margin: '8px 0' }}
        >
          下载参会人员信息
        </Button>
        <Table
          rowKey={record => record.id.toString()}
          columns={columns}
          dataSource={props.participants}
          pagination={false}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, user, meeting }: ConnectState) => ({
  currentMeeting: meeting.currentMeeting,
  participants: meeting.participants,
  userId: user.id,
  manageMeetingLoading: loading.effects['meeting/getManageMeeting'],
  checkInLoading: loading.effects['meeting/checkIn'],
}))(ManageMeeting);
