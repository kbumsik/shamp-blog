import React from 'react';
import { observer } from 'mobx-react-lite';

import stores from '@stores';
import SideTokenList from './SideTokenList';
import SideNoTokenList from './SideNoTokenList';

const SideTokenMenu = () => {
  const { signStore } = stores();
  const { userData, cookieChecked } = signStore;

  if (!cookieChecked) return null;

  return userData ? <SideTokenList /> : <SideNoTokenList />;
};

export default observer(SideTokenMenu);
