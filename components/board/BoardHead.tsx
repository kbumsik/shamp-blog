import React, { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import useStores from '@stores/useStores';
import BoardTag, { Tag } from './BoardTag';

const BoardHead = () => {
  const router = useRouter();
  if (!router.query.board) return null;
  const {
    SidebarStore, CategoryStore, SignStore,
    PostStore,
  } = useStores();
  const { getCategoryName } = SidebarStore;
  const { categoryTags } = CategoryStore;
  const { userData } = SignStore;
  const { clearPost } = PostStore;

  const categoryPath = router.query.board[0];
  const categoryTag = router.query.board[1];

  const isAdmin = Boolean(userData?.adminFl);
  const isBestOrAll = categoryPath === 'best' || categoryPath === 'all';
  const isBest = categoryTag === 'best';

  const categoryName = useMemo(() => getCategoryName(categoryPath), [categoryPath]);

  const goPost = useCallback(() => {
    router.push('/post').then(clearPost);
  }, [router, clearPost]);

  const postButton = useMemo(() => (
    isAdmin ? (
      <AbsoluteUl>
        <li>
          <Button variant="contained" color="primary" onClick={goPost}>
            <span>
              <CustomIcon icon={faPen} />
            </span>
          </Button>
        </li>
      </AbsoluteUl>
    ) : null), [isAdmin]);

  const bestTag = useMemo(() => (
    isBestOrAll ? null : (
      <BestTag isActive={isBest}>
        <Link href={`/category/${categoryPath}/best`}>인기글</Link>
      </BestTag>
    )), [isBestOrAll, isBest]);

  return (
    <Wrapper>
      <HeadSection>
        <SubTitle>
          <h2>{categoryName}</h2>
          {postButton}
        </SubTitle>
      </HeadSection>
      <HeadSection>
        <CategoryTag>
          {bestTag}
          <Tag isActive={categoryTag === undefined}>
            <Link href={`/category/${categoryPath}`}>전체</Link>
          </Tag>
          {categoryTags.map((tag) => <BoardTag key={tag} tag={tag} />)}
        </CategoryTag>
      </HeadSection>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.15);
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const CategoryTag = styled.ul`
  list-style: none;
  overflow-x: visible;
  overflow-y: hidden;
  white-space: nowrap;

  &::-webkit-scrollbar {
    width: 10px;
    height: 6px;
    background: transparent;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #2d79c7;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #ebeef1;;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

const BestTag = styled(Tag)(({ isActive }) => ({
  '> a': {
    border: '#eeee00 1.5px solid',
    backgroundColor: '#fff',
    color: '#eeee00',
    height: '21px',

    ...(isActive ? ({
      color: '#fff !important',
      backgroundColor: '#eeee00 !important',
    }) : null),
  },
}));

const HeadSection = styled.div`
  background-color: #fff;
  
  &:first-of-type {
    border-top-right-radius: 14px;
    border-top-left-radius: 14px;
  }

  &:last-child {
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
  }
`;

const SubTitle = styled.div`
  position: relative;
  font-size: 18px;
  padding: 18px 0;
  border-bottom: solid 1px #e6e6e6;

  & > h2 {
    padding-left: 16px;
    font-size: 18px;
  }

  & > li {
    cursor: pointer;
  }
`;

const CustomIcon = styled(FontAwesomeIcon)`
  width: 18px;
  height: 18px;
  vertical-align: text-bottom;
`;

const AbsoluteUl = styled.ul`
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 9px;
  margin-right: 10px;
  list-style: none;

  & > li {
    display: inline-block;
    color: #2d79c7;
    cursor: pointer;
  }
`;

export default observer(BoardHead);
