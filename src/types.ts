export interface MenuItem {
  link: string;
  text: string;
  subMenu?: Array<MenuItem>;
  action?: string;
}
