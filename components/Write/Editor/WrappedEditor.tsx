import React, { MutableRefObject } from 'react';
import { Editor, EditorProps } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import styled from '@emotion/styled';

export interface Props extends EditorProps {
  forwardedRef?: MutableRefObject<Editor>;
}

const WrappedEditor = (props: Props) => {
  const { forwardedRef } = props;
  return (
    <Root>
      <Editor {...props} ref={forwardedRef} />
    </Root>
  );
};

const Root = styled.div({
  '&&& *': {
    fontFamily: 'inherit',
  },

  '.ProseMirror': {
    fontSize: '1.125rem',
  },

  '.toastui-editor-md-heading1': {
    fontSize: '2.5rem',
  },

  '.toastui-editor-md-heading2': {
    fontSize: '2rem',
  },

  '.toastui-editor-md-heading3': {
    fontSize: '1.5rem',
  },

  '.toastui-editor-md-heading4': {
    fontSize: '1.125rem;',
  },
});

export default WrappedEditor;