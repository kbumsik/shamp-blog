import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import useStores from '../../stores/useStores';

const ConfirmModal: React.FC = () => {
  const { UtilStore } = useStores();
  const {
    isOpenConfirmModal, callback,
    text, closeConfirmModal, callFunction,
  } = UtilStore;

  return (
    <CustomModal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpenConfirmModal}
      onClose={closeConfirmModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpenConfirmModal}>
        <Paper>
          <h2 id="transition-modal-title">알림</h2>
          <div>
            {text}
          </div>
          <RightButton variant="contained" color="primary" onClick={() => callFunction(callback)}>확인</RightButton>
          <RightButton variant="contained" onClick={closeConfirmModal}>취소</RightButton>
        </Paper>
      </Fade>
    </CustomModal>
  );
};

const CustomModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Paper = styled.div`
  margin: 0 40px;
  width: 300px;
  max-width: 100%;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.15);
  padding: 15px;
  
  &:focus {
    outline: 0;
  }
  
  & > h2 {
    margin-bottom: 10px;
    padding: 10px 0;
  }
  
  & > div {
    padding: 20px 0;
    border-bottom: 1px solid #e6e6e6;
    border-top: 1px solid #e6e6e6;
    margin-bottom: 10px;
  }
`;

const RightButton = styled(Button)`
  float: right;
  margin-left: 5px !important;
`;

export default observer(ConfirmModal);