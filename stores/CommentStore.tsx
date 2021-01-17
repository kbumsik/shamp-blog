import React from 'react';
import { action, makeObservable, observable } from 'mobx';
import axios from 'axios';
import { toast } from 'react-toastify';
import {initialPost} from "./PostStore";

interface CommentInterface {
  id: number,
  commentId: number,
  userId: number,
  content: string,
  time: string,
}

class CommentStore {
  @observable comment: string = '';

  @observable commentList: Array<CommentInterface> = [];

  constructor(initialData = initialComment) {
    makeObservable(this);
    this.commentList = initialData.commentList;
  }

  @action commentHandleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.comment = event.target.value;
  };

  @action addComment = (postId: number): void => {
    axios.post('/api/post/comment', {
      postId,
      comment: this.comment,
    })
      .then((response) => {
        const { data } = response;
        if (data.success) {
          toast.success(data.message);
          this.comment = '';
        } else {
          toast.error(data.message);
        }
      })
      .catch((response) => {
        toast.error(response);
      });
  };

  @action getComment = async (postId: number): Promise<any> => {
    await axios.get('http://localhost:3000/api/post/comment', {
      params: {
        postId,
      },
    })
      .then((response) => {
        const { data } = response;
        if (data.success) {
          const { result } = data;
          this.commentList = result;
        } else {
          toast.error(data.message);
        }
      })
      .catch((response) => {
        toast.error(response);
      });
  };
}

export const initialComment = {
  commentList: [],
};

export default CommentStore;
