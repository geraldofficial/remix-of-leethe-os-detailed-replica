export interface AppWindow {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface AppDef {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ComponentType<{ windowId: string }>;
  defaultWidth: number;
  defaultHeight: number;
}
