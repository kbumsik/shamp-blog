import * as T from '@types';

export enum FontFamily {
  ROBOTO = 'Roboto',
  NOTO_SANS_KR = 'Noto Sans KR',
  PT_SANS = 'PT Sans',
  JETBRAINS_MONO = 'JetBrains Mono',
  SERIF = 'serif',
}

export const DeviceWidth = {
  [T.Device.MOBILE]: 768,
  [T.Device.TABLET]: 1056,
  [T.Device.LAPTOP]: 1440,
  [T.Device.DESKTOP]: 1920,
};

export const MediaQuery = {
  [T.Device.MOBILE]: `@media(max-width: ${DeviceWidth[T.Device.MOBILE]}px)`,
  [T.Device.TABLET]: `@media(max-width: ${DeviceWidth[T.Device.TABLET]}px)`,
  [T.Device.LAPTOP]: `@media(max-width: ${DeviceWidth[T.Device.LAPTOP]}px)`,
  [T.Device.DESKTOP]: `@media(max-width: ${DeviceWidth[T.Device.DESKTOP]}px)`,
};
