export enum checkType {
  oceanbase = "oceanbase",
  classic = "classic",
  custom = "custom"
}

export enum hierarchyType {
  BL = -3,
  SP = -2,
  CUSTOMER = -1,
  ORGANIZATION = 0,
  SITE = 1,
  BUILDING = 2,
  ROOM = 3,
  PANEL = 4,
  DEVICE = 5,
  AREA = 6,
  CIRCUIT = 7
}

export enum logic {
  and = 1,
  or = 2
}

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
  hasDataAuth?: (userId: number, dataPrivilegeData: DataPrivilegeData) => boolean;
  rel?: logic;
};

type hierachyParams = { type: hierarchyType; key: string };

export type multipleHierachyParams = Array<hierachyParams>;

export type DecoratorType = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

export function dataPrivilegeDecorator(hierarchy: hierarchyType, key: string, params?: checkParams): DecoratorType;

export function dataPrivilegeDecorators(
  multipleHierachyParams: multipleHierachyParams,
  params?: checkParams
): DecoratorType;
