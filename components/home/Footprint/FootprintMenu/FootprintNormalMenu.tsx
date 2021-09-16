import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';

import stores from '@stores';
import * as T from '@types';

export interface Props {
  data: T.FootPrint;
}

const FootprintNormalMenu = ({ data }: Props) => {
  const { homeStore, utilStore } = stores();
  const { id, content } = data;

  const onDelete = useCallback(() => {
    homeStore.deleteFootprint(id);
  }, [id]);

  const onConfirm = useCallback(() => {
    utilStore.openPopup(T.Popup.CONFIRM, '해당 발자취를 삭제하시겠습니까?', onDelete);
  }, []);

  const onModify = useCallback(() => {
    homeStore.setModifierFootprintId(id, content);
  }, [id, content]);

  return (
    <FootprintMenu>
      <span
        role="button"
        tabIndex={0}
        onClick={onConfirm}
        onKeyDown={onConfirm}
      >
        삭제
      </span>
      <span
        role="button"
        tabIndex={0}
        onClick={onModify}
        onKeyDown={onModify}
      >
        수정
      </span>
    </FootprintMenu>
  );
};

const FootprintMenu = styled.div`
  margin-top: 8px;
  font-size: 14px;
  
  & > span {
    margin-right: 10px;
    cursor: pointer;
  }
  
  & > span:first-of-type {
    color: #dc143c;
    margin-right: 10px;
  }
  
  & > span:last-child {
    color: #7b858e;
  }
`;

export default observer(FootprintNormalMenu);
