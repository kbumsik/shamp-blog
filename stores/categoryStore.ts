import { observable } from 'mobx';

import Axios from '@util/Axios';
import * as T from '@types';

export interface CategoryStore {
  categoryTags: string[];
  getCategoryTags(category: string): Promise<void>;
}

const categoryStore: CategoryStore = {
  categoryTags: [],
  async getCategoryTags(category) {
    await Axios({
      method: T.RequestMethod.GET,
      url: `${process.env.BASE_PATH}/api/category/tag`,
      data: { category },
      success: (response) => {
        const { result } = response.data;
        this.categoryTags = result.map((row: T.Tag) => row.tag);
      },
    });
  },
};

export const initialCategory: {
  categoryTags: string[],
} = {
  categoryTags: [],
};

export default (() => {
  let instance: CategoryStore | undefined;
  const initialize = (initialState = initialCategory) => ({
    ...categoryStore,
    ...initialState,
  });
  return (initialState = initialCategory) => {
    if (!instance) {
      instance = initialize(initialState);
    }
    return observable(instance);
  };
})();
