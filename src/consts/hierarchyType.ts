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

export function getOceanBaseObjectType(hierarchy: number): number {
  switch (hierarchy) {
    case hierarchyType.BL:
      return 1;
    case hierarchyType.SP:
      return 2;
    case hierarchyType.CUSTOMER:
      return 3;
    default:
      return 4;
  }
}

export function getClassicObjectType(): number {
  return 0;
}
