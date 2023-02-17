import { hierarchyType } from "./hierarchyType";
import { logic } from "./logic";
import { checkType } from "./checkType";

export interface PrivilegeItem {
  type: hierarchyType;
  key: string;
  id: string;
}

export interface DataPrivilegeData {
  items: Array<PrivilegeItem>;
  rel?: logic;
}

export type checkParams = {
  type: checkType;
  hasDataAuth: (userId: number, dataPrivilegeData: DataPrivilegeData) => boolean;
  rel: logic;
};

type hierachyParams = { type: hierarchyType; key: string };

export type multipleHierachyParams = Array<hierachyParams>;
