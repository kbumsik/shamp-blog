import { makeObservable } from 'mobx';
import React from 'react';
import socketio from 'socket.io-client';
import dayjs from 'dayjs';
import makeAnnotations from '../util/Mobx';
import Axios from '../util/Axios';
import AlertStore from './AlertStore';

export interface ChatType {
  id: number;
  fromUserName?: string;
  fromUserId: number;
  message: string;
  time: string;
  displayedTime: string;
}

export interface ChatRoomType {
  id: number;
  fromUserId: number;
  fromUserName: string;
  toUserId: number;
  toUserName: string;
  message: string;
  time: string;
}

interface ReceiveMessageType {
  message: string,
  userId: number,
}

class ChatStore {
  AlertStore: AlertStore;

  isChatOpen = false;

  isChatLoading = true;

  chatRoomList: Array<ChatRoomType> = [];

  // 0: ChatLobby
  // 1: ChatRoom
  chatPage = 0;

  chat = '';

  chatList: Array<ChatType> = [];

  toUserId = -1;

  chatTempId = 0;

  notReadChatCount = 0;

  chatSocket: SocketIOClient.Socket | null = null;

  socketId = '';

  constructor(root: { AlertStore: AlertStore }) {
    this.AlertStore = root.AlertStore;
    makeObservable(this, makeAnnotations<this>({
      observables: [
        'isChatOpen', 'chat', 'chatList', 'chatRoomList',
        'chatPage', 'isChatLoading', 'notReadChatCount',
      ],
      actions: [
        'openChat', 'onChangeChat', 'getChatList', 'moveChatPage',
        'sendChat',
      ],
      computeds: ['displayedChatList'],
    }));
  }

  openChat = (loggedIn: boolean, isAdmin: boolean): void => {
    if (!this.isChatOpen) {
      if (!loggedIn) {
        this.AlertStore.toggleAlertModal('채팅은 로그인 이후 이용하실 수 있습니다! 비회원은 곧 지원 예정입니다.');
        return;
      }

      if (isAdmin) {
        this.chatPage = 0;
        this.getChatRoomList();
      } else {
        this.chatPage = 1;
        this.getChatListAndConnect(0);
      }
    }
    this.isChatOpen = !this.isChatOpen;
  };

  getChatListAndConnect = async (userId: number) => {
    this.isChatLoading = true;
    this.toUserId = userId;
    await Promise.all([this.getChatList(userId), this.getSocketId(userId)]);
    this.isChatLoading = false;
  };

  connectSocket = () => {
    this.chatSocket = socketio.connect('http://localhost');
    this.chatSocket.emit('get_socket_id');
    this.chatSocket.on('send_socket_id', this.updateSocketId);
    this.chatSocket.on('receive_message', ({ message, userId }: ReceiveMessageType) => {
      if (this.toUserId === userId && this.isChatOpen) {
        this.chatTempId -= -1;
        const time = this.getChatTime();
        this.chatList = [
          ...this.chatList,
          {
            id: this.chatTempId,
            fromUserId: userId,
            message,
            time,
            displayedTime: '',
          },
        ];
      } else {
        this.notReadChatCount += 1;
      }
    });
  };

  getSocketId = async (userId: number) => {
    await Axios({
      method: 'get',
      url: '/api/chat/socket',
      data: {
        userId,
      },
      success: (response) => {
        const { result } = response.data;
        this.socketId = result;
      },
    });
  };

  updateSocketId = (socketId: string) => {
    Axios({
      method: 'put',
      url: '/api/chat/socket',
      data: {
        socketId,
      },
    });
  };

  getChatRoomList = () => {
    this.isChatLoading = true;
    Axios({
      method: 'get',
      url: '/api/chat/room',
      success: (response) => {
        const { result } = response.data;
        this.chatRoomList = result;
        this.isChatLoading = false;
      },
    });
  };

  get displayedChatList(): Array<ChatType> {
    let beforeTime = '';
    return this.chatList.map((data) => {
      const { time } = data;
      const displayedTime = beforeTime === time ? '' : time;
      beforeTime = time;
      return {
        ...data,
        displayedTime,
      };
    });
  }

  getChatList = async (userId: number) => {
    await Axios({
      method: 'get',
      url: '/api/chat',
      data: {
        userId,
      },
      success: (response) => {
        const { result } = response.data;
        this.chatList = result;
      },
    });
  };

  addChat = async (userId: number, toUserId: number, time: string) => {
    await Axios({
      method: 'post',
      url: '/api/chat',
      data: {
        userId: toUserId,
        message: this.chat,
      },
      success: () => {
        this.chatTempId -= -1;
        this.chatList = [
          ...this.chatList,
          {
            id: this.chatTempId,
            fromUserId: userId,
            message: this.chat,
            time,
            displayedTime: '',
          },
        ];
      },
    });
  };

  onChangeChat = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.chat = event.target.value;
  };

  moveChatPage = async (page: number, userId: number) => {
    if (page === 0) {
      this.getChatRoomList();
    } else if (page === 1) {
      this.getChatListAndConnect(userId);
    }
    this.chatPage = page;
  };

  sendChat = async (userId: number, scrollRef: React.RefObject<HTMLDivElement>) => {
    if (!this.chatSocket) return;
    this.chatSocket.emit('send_message', {
      userId,
      message: this.chat,
      socketId: this.socketId,
    });

    const time = this.getChatTime();
    await this.addChat(userId, this.toUserId, time);
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    this.chatTempId -= 1;
    this.chat = '';
  };

  onKeyPressChat = (event: React.KeyboardEvent<HTMLTextAreaElement>, userId: number) => {
    if (event.key === 'Enter') {
      this.sendChat(userId);
      return false;
    }
  };

  getChatTime = () => dayjs().format('hh:mm A');
}

export default ChatStore;
