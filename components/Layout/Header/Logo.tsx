import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';

import dsPalette from '@constants/ds-palette';
import LogoSVG from '@assets/icon/logo.svg';
import { FontFamily } from '@constants/styles';

const Logo = () => (
  <Root>
    <Link href="/" passHref>
      <Wrapper>
        <LogoSVG />
        <Title>Shamp Blog</Title>
      </Wrapper>
    </Link>
  </Root>
);

const Root = styled.div({
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
});

const Wrapper = styled.a({
  display: 'flex',
  alignItems: 'center',
  textDecorationLine: 'none',
});

const Title = styled.div({
  maxWidth: 'calc(100vw - 170px)',
  color: dsPalette.themePrimary.toString(),
  fontSize: '1.3125rem',
  fontWeight: 700,
  fontFamily: FontFamily.PT_SANS,
  marginLeft: '1rem',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

export default Logo;
