import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import FootprintNormalMenu from './FootprintNormalMenu';
import FootprintModifyMenu from './FootprintModifyMenu';
import useStores from '../../../../stores/useStores';
import { RootStore } from '../../../../stores';

interface FootprintMenuProp {
  data: FootprintRowInterface;
}

export interface FootprintRowInterface {
  id: number,
  userId: number,
  userName: string,
  content: string,
  time: string,
  modifiedTime: string,
}

const FootprintMenu: FC<FootprintMenuProp> = ({ data }: FootprintMenuProp) => {
  const { HomeStore } = useStores() as RootStore;
  const { modifierFootprintId } = HomeStore;
  const { id } = data;

  return id === modifierFootprintId
    ? <FootprintModifyMenu /> : <FootprintNormalMenu data={data} />;
};

export default observer(FootprintMenu);
