import React from 'react';
import { useRouter } from 'next/router';

import * as T from '@types';
import stores from '@stores';
import BoardHead from '../../components/board/BoardHead';
import BoardContent from '../../components/board/BoardContent';
import BoardPagination from '../../components/board/BoardPagination';
import PostView from '../../components/PostView';
import {NextPageContext} from "next";

const Board = () => {
  const router = useRouter();
  if (!router.query.board) return null;

  const { alertStore, sidebarStore } = stores();
  const { toggleAlertModal } = alertStore;
  const { boardCategoryName } = sidebarStore;

  if (!boardCategoryName[router.query.board[0]]) {
    router.push('/').then(() => toggleAlertModal('존재하지 않는 게시판입니다.'));
    return null;
  }

  if (router.query.board[1] === 'post') return <PostView />;

  return (
    <>
      <BoardHead />
      <BoardContent />
      <BoardPagination />
    </>
  );
};

Board.getInitialProps = async ({ query }: NextPageContext) => {
  if (!query.board) return null;

  const board = query.board[0];
  const tag = query.board[1];
  if (tag === 'post') {
    const { postStore, commentStore } = stores();

    const id = Number(query.board[2]);

    await Promise.all([
      postStore.getPost(id, false),
      commentStore.getComment(id),
    ]);
  } else {
    const { categoryStore, postStore } = stores();

    const page = Number(query.page ?? 1);

    await Promise.all([
      postStore.getPostList(board, tag, page),
      categoryStore.getCategoryTags(board),
    ]);
  }

  return {
    props: {},
  };
};

export default Board;
