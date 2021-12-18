import React, { MouseEvent, ChangeEvent, KeyboardEvent } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import styled from '@emotion/styled';

import WriteSection from './WriteSection';
import ViewerSection from './ViewerSection';
import dsPalette from '@constants/ds-palette';

interface Form {
  inputs: {
    title: string;
    tag: string;
    content: string;
  };
  tags: string[];
  onChange(event: ChangeEvent<HTMLInputElement>): void;
  onChangeContent(value: string): void;
  onKeyPress(event: KeyboardEvent<HTMLInputElement>): void;
  onDelete(event: MouseEvent<HTMLElement>): void;
}

const Write = () => {
  const form = useLocalObservable<Form>(() => ({
    inputs: {
      title: '',
      tag: '',
      content: '',
    },
    tags: [],
    onChange(event) {
      this.inputs = {
        ...this.inputs,
        [event.target.name]: event.target.value,
      };
    },
    onChangeContent(value: string) {
      this.inputs.content = value;
    },
    onKeyPress(event) {
      const { tags, inputs: { tag } } = this;
      if (event.key === 'Enter' && tag) {
        if (!tags.includes(this.inputs.tag)) tags.push(tag);
        this.inputs.tag = '';
      }
    },
    onDelete(event) {
      const idx = this.tags.indexOf(event.currentTarget.innerText);
      if (idx > -1) {
        this.tags.splice(idx, 1);
      }
    },
  }));

  return (
    <Root>
      <WriteSection
        title={form.inputs.title}
        tag={form.inputs.tag}
        tags={form.tags}
        content={form.inputs.content}
        onChange={form.onChange}
        onChangeContent={form.onChangeContent}
        onKeyPress={form.onKeyPress}
        onDelete={form.onDelete}
      />
      <ViewerSection
        title={form.inputs.title}
        content={form.inputs.content}
      />
    </Root>
  );
};

const Root = styled.div({
  display: 'flex',
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  background: dsPalette.themeWhite.toString(),
});

export default observer(Write);
