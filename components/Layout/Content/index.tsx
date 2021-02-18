import React, { ReactNode, FC } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import useStores from '../../../stores/useStores';

interface ContentProp {
  children: ReactNode;
}

const Content: FC<ContentProp> = ({ children }: ContentProp) => {
  const { SignStore } = useStores();
  const { cookieChecked } = SignStore;

  // 쿠키 내의 토큰 체크가 되기 전
  if (!cookieChecked) {
    return null;
  }

  return (
    <Wrapper>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  float: right;
  box-sizing: border-box;
  width: 728px;
  margin-bottom: 20px;
  
  @media (max-width: 1064px) {
    width: 100%;
  }
`;

export default observer(Content);
