import { Badge, Icon, Spin, Tabs } from 'antd';
import React, { useState } from 'react';
import classNames from 'classnames';
import NoticeList, { NoticeIconTabProps } from './NoticeList';

import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const { TabPane } = Tabs;

export interface NoticeIconData {
  avatar?: string | React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  datetime?: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  key?: string | number;
  read?: boolean;
}

export interface NoticeIconComponentProps {
  count?: number;
  bell?: React.ReactNode;
  className?: string;
  loading?: boolean;
  emptyImage?: string;
  onClear?: (tabName: string, tabKey: string) => void;
  onItemClick?: (item: NoticeIconData, tabProps: NoticeIconTabProps) => void;
  onViewMore?: (tabProps: NoticeIconTabProps, e: MouseEvent) => void;
  onTabChange?: (tabTile: string) => void;
  style?: React.CSSProperties;
  onPopupVisibleChange?: (visible: boolean) => void;
  popupVisible?: boolean;
  clearText?: string;
  viewMoreText?: string;
  clearClose?: boolean;
  children: React.ReactElement<NoticeIconTabProps>[];
}

const NoticeIcon: React.FC<NoticeIconComponentProps> = ({
  onItemClick = (): void => {},
  onPopupVisibleChange = (): void => {},
  onTabChange = (): void => {},
  onClear = (): void => {},
  onViewMore = (): void => {},
  loading = false,
  clearClose = false,
  clearText,
  children,
  viewMoreText,
  className,
  emptyImage = 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
  ...props
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  const handleItemClick = (item: NoticeIconData, tabProps: NoticeIconTabProps): void => {
    if (onItemClick) {
      onItemClick(item, tabProps);
    }
  };

  const handleClear = (name: string, key: string): void => {
    if (onClear) {
      onClear(name, key);
    }
  };

  const handleTabChange = (tabType: string): void => {
    if (onTabChange) {
      onTabChange(tabType);
    }
  };

  const handleViewMore = (tabProps: NoticeIconTabProps, event: MouseEvent): void => {
    if (onViewMore) {
      onViewMore(tabProps, event);
    }
  };

  const handleVisibleChange = (isVisible: boolean): void => {
    setVisible(isVisible);
    if (onPopupVisibleChange) {
      onPopupVisibleChange(isVisible);
    }
  };

  const getNotificationBox: any = () => {
    if (!children) {
      return null;
    }

    const panes = React.Children.map(
      children,
      (child: React.ReactElement<NoticeIconTabProps>): React.ReactNode => {
        if (!child) {
          return null;
        }
        const { list, title, count, tabKey, showClear, showViewMore } = child.props;
        const len = list && list.length ? list.length : 0;
        const msgCount = count || count === 0 ? count : len;
        const tabTitle: string = msgCount > 0 ? `${title} (${msgCount})` : title;
        return (
          <TabPane tab={tabTitle} key={title}>
            <NoticeList
              clearText={clearText}
              viewMoreText={viewMoreText}
              data={list}
              onClear={(): void => handleClear(title, tabKey)}
              onClick={(item): void => handleItemClick(item, child.props)}
              onViewMore={(event): void => handleViewMore(child.props, event)}
              showClear={showClear}
              showViewMore={showViewMore}
              title={title}
              {...child.props}
            />
          </TabPane>
        );
      },
    );

    return (
      <>
        <Spin spinning={loading} delay={300}>
          <Tabs className={styles.tabs} onChange={handleTabChange}>
            {panes}
          </Tabs>
        </Spin>
      </>
    );
  };

  const { bell, count, popupVisible } = props;
  const noticeButtonClass = classNames(className, styles.noticeButton);
  const notificationBox = getNotificationBox();
  const NoticeBellIcon = bell || <Icon type="bell" className={styles.icon} />;
  const trigger = (
    <span className={classNames(noticeButtonClass, { opened: visible })}>
      <Badge count={count} style={{ boxShadow: 'none' }} className={styles.badge}>
        {NoticeBellIcon}
      </Badge>
    </span>
  );
  if (!notificationBox) {
    return trigger;
  }
  const popoverProps: {
    visible?: boolean;
  } = {};
  if ('popupVisible' in props) {
    popoverProps.visible = popupVisible;
  }

  return (
    <HeaderDropdown
      placement="bottomRight"
      overlay={notificationBox}
      overlayClassName={styles.popover}
      trigger={['click']}
      visible={visible}
      onVisibleChange={handleVisibleChange}
      {...popoverProps}
    >
      {trigger}
    </HeaderDropdown>
  );
};

export default NoticeIcon;
