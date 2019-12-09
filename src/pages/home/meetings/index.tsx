import React, { useEffect, useState } from 'react';
import { Card, Table, Radio, Divider, Button, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { IMeetingListItem, ICurrentMeetingState } from '@/models/meeting';
import { RouterTypes, router } from 'umi';
import qs from 'querystring';

interface MeetingsComponentProps extends RouterTypes {
  dispatch: Dispatch<AnyAction>;
  meetings: IMeetingListItem[];
  total: number;
  loading: boolean;
  role: number;
  userId: number;
  currentMeeting: ICurrentMeetingState;
  getCurrentMeetingLoading: boolean;
}

const Meetings: React.FC<MeetingsComponentProps> = props => {
  const [currentSelectedMeeting, setCurrentSelectedMeeting] = useState<string>('0');

  useEffect(() => {
    if (props.dispatch) {
      const page =
        parseInt(
          JSON.parse(JSON.stringify(qs.parse(props.location.search.substring(1)))).page, 10) || 1;

      const type =
        JSON.parse(JSON.stringify(qs.parse(props.location.search.substring(1)))).type || 'all';

      switch (type) {
        case 'all':
          props.dispatch({
            type: 'meeting/getAllMeetings',
            payload: page,
          });
          break;
        case 'created':
            props.dispatch({
              type: 'meeting/getCreatedMeetings',
              payload: page,
            });
          break;
        case 'joined':
          props.dispatch({
            type: 'meeting/getJoinedMeetings',
            payload: page,
          });
          break;
        default:
          break;
      }
    }
  }, [props.location.search]);

  const handleTypeChange = (e: any) => {
    const query = JSON.parse(JSON.stringify(qs.parse(props.location.search.substring(1))));
    const newQuery = {
      ...query,
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
          value={JSON.parse(JSON.stringify(qs.parse(props.location.search.substring(1)))).type || 'all'}
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
            defaultCurrent:
              parseInt(
                JSON.parse(
                  JSON.stringify(qs.parse(props.location.search.substring(1)))).page, 10) || 1,
            total: props.total,
          }}
          onChange={newPage => {
            const query = JSON.parse(JSON.stringify(qs.parse(props.location.search.substring(1))));
            const newQuery = {
              ...query,
              page: newPage.current,
            };
            router.push(`/meetings?${qs.stringify(newQuery)}`);
          }}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ meeting, user, loading }: ConnectState) => ({
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
}))(Meetings);
