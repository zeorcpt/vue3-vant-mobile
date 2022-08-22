/* eslint-disable @typescript-eslint/no-explicit-any */
import { VNodeTypes } from 'vue';

export interface Props {
  row: any;
  column: TableColumnsItem;
  index: number;
}

export type H = typeof h;

export type Render = (h: H, props: Props) => VNodeTypes;

export interface TableColumnsItem {
  key: string;
  title: string;
  render?: Render;
  slot?: string;
  break?: boolean; // 超长内容是否换行
}

export type TableRowItem<T = any> = T & {
  _index?: number;
  _parentIndex?: number;
  _expand?: boolean; // 是否展开子行，字段无表示当前行无展开
  _hide?: boolean; // 当前行是否隐藏
  _checked?: boolean; // 当前行是否勾选，字段无表示当前行无勾选
  _active?: boolean; // 是否点击当前行，添加背景色
  children?: TableRowItem[];
};

export interface Page {
  pageNum: number;
  pageSize: number;
}
