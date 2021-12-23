import { observable } from 'mobx';
import cookie from 'js-cookie';
import axios from 'axios';

import * as T from '@types';
import utilStore from './utilStore';

export interface SignStore {
  authChecked: boolean;
  userData: T.User | null;
  authCheck(): void;
  signIn(form: {
    email: string;
    password: string;
  }): Promise<T.Response>;
  signOut(): void;
}

const signStore: SignStore = {
  authChecked: false,
  userData: null,
  async authCheck() {
    const { data } = await axios.get('/api/user/cookie');
    this.userData = data.result;
    this.authChecked = true;
  },
  async signIn(signInForm) {
    const res = await axios.post<T.Response>('/api/user/login', signInForm);
    return res.data;
  },
  signOut() {
    utilStore.closeHeaderMenu();
    cookie.remove('auth');
    this.userData = null;
  },
};

export default observable(signStore);
