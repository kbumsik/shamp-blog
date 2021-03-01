import React from 'react';
import { observer } from 'mobx-react-lite';
import useStores from '../../../stores/useStores';
import HeaderTokenList from './HeaderTokenList';
import HeaderNoTokenList from './HeaderNoTokenList';
import { RootStore } from '../../../stores';

const HeaderTokenMenu = () => {
  const { SignStore } = useStores() as RootStore;
  const { userData, cookieChecked } = SignStore;
  const loggedIn = !!userData;

  // 쿠키 내의 토큰 체크가 되기 전
  if (!cookieChecked) {
    return null;
  }

  return loggedIn ? <HeaderTokenList /> : <HeaderNoTokenList />;
};

export default observer(HeaderTokenMenu);
