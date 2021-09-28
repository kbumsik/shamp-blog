import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';

import stores from '@stores';
import Button from '@atoms/Button';
import * as T from '@types';

const Footer = () => {
  const router = useRouter();
  const { postStore, utilStore, signStore } = stores();
  const { postView } = postStore;
  if (!postView) return null;

  const { id } = postView;
  const { userData } = signStore;

  const onDelete = useCallback(() => {
    postStore.deletePost(id, router);
  }, []);

  const onDeleteConfirm = useCallback(() => {
    utilStore.openPopup(T.Popup.CONFIRM, '해당 게시글을 삭제하시겠습니까?', onDelete);
  }, []);

  const onModify = useCallback(() => {
    router.push(`/post/modify/${id}`, undefined, { shallow: false });
  }, []);

  if (!userData?.adminFl) return null;

  return (
    <ArticleFooterWrapper>
      <Button
        size={T.ButtonSize.SMALL}
        variant="outlined"
        color="secondary"
        onClick={onDeleteConfirm}
      >
        삭제
      </Button>
      <Button
        size={T.ButtonSize.SMALL}
        variant="outlined"
        color="primary"
        onClick={onModify}
      >
        수정
      </Button>
    </ArticleFooterWrapper>
  );
};

const ArticleFooterWrapper = styled.div`
  background: #f8f9fa;
  padding: 12px;
  text-align: right;
  
  & > button {
    margin-left: 5px;
  }
`;

export default observer(Footer);