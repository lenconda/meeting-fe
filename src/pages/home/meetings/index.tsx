import React, { useEffect } from 'react';
import { Card, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { IMeetingListItem } from '@/models/meeting';
import { RouterTypes, router } from 'umi';
import qs from 'querystring';

interface MeetingsComponentProps extends RouterTypes {
  dispatch: Dispatch<AnyAction>;
  meetings: IMeetingListItem[];
  total: number;
  loading: boolean;
}

const Meetings: React.FC<MeetingsComponentProps> = props => {
  useEffect(() => {
    if (props.dispatch) {
      const page =
        parseInt(
          JSON.parse(JSON.stringify(qs.parse(props.location.search.substring(1)))).page, 10) || 1;

      props.dispatch({
        type: 'meeting/getAllMeetings',
        payload: page,
      });
    }
  }, [props.location.search]);

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
      render: (record: IMeetingListItem) => {
        console.log(record);
        return (
          <span>
            <a>详情</a>
            <a>删除</a>
          </span>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper>
      <Card>
        <Table
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
            router.push(`/meetings?page=${newPage.current}`);
          }}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ meeting, loading }: ConnectState) => ({
  meetings: meeting.meetings,
  total: meeting.total,
  loading: loading.effects['meeting/getAllMeetings'],
}))(Meetings);
