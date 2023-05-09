import {ViewOrderTypes} from "./view.order.types";

export interface View {
  type: 'list' | 'board';
  orderBy: ViewOrderTypes;
}
