import { PopupProps } from 'zarm/lib/popup/Popup';
declare module 'zarm/lib/popup/Popup' {
  interface PopupProps {
    children?: React.ReactNode;
  }
}

import { ConfigProviderProps } from 'zarm/lib/config-provider/PropsType';
declare module 'zarm/lib/config-provider/PropsType' {
  interface ConfigProviderProps {
    children?: React.ReactNode;
  }
}
