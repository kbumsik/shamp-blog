import React from 'react';
import { observer } from 'mobx-react-lite';

import stores from '@stores';
import CommentNormalMenu, { Props } from './CommentNormalMenu';
import CommentModifyMenu from './CommentModifyMenu';

const CommentMenu = ({ data }: Props) => {
  const { CommentStore } = stores();
  const { modifierCommentId } = CommentStore;
  const { id } = data;

  if (id === modifierCommentId) return <CommentModifyMenu />;

  return <CommentNormalMenu data={data} />;
};

export default observer(CommentMenu);
