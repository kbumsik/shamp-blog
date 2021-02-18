import React, { FC } from 'react';
import HomePost, { PostInterface } from './HomePost';

interface HomePostListProps {
  array: Array<PostInterface>;
}

const HomePostList: FC<HomePostListProps> = ({ array }: { array: Array<PostInterface> }) => (
  <div>
    {array.map(
      (data: PostInterface) => <HomePost data={data} key={data.id} />,
    )}
  </div>
);

export default HomePostList;
