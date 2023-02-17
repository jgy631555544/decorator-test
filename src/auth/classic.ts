import axios from "../utils/axios";
import { DataPrivilegeData, PrivilegeItem } from "../consts/types";
import { logic } from "../consts/logic";
import customException from "../exception";
import { Api } from "../consts/api";
import { getClassicObjectType } from "../consts/hierarchyType";
import logger from "../utils/logger";

function classicAuth(userId: number, privilegeItem: PrivilegeItem): Promise<boolean> {
  const classicHost: string = process.env.CLASSIC_AUTH_HOST as string;
  const classicUrl = `${classicHost}${Api.classic}/${userId}/${getClassicObjectType()}/${privilegeItem.id}`;
  try {
    return axios.get(classicUrl).then((res: any) => {
      const data = res.data;
      logger.info(`[DataPrivilege] response is ${JSON.stringify(data)}`);
      if (data.Error === "0") {
        if (data.Result) {
          logger.info(`[DataPrivilege] ${privilegeItem.id} auth success`);
          return true;
        } else {
          logger.info(`[DataPrivilege] ${privilegeItem.id} auth fail`);
          return false;
        }
      } else {
        logger.error(`[DataPrivilege] classic throw error: ${data.error}`);
        throw new customException(`[DataPrivilege] classic throw error: ${data.error}`);
      }
    });
  } catch (e) {
    return Promise.resolve(false);
  }
}

export default async function classicDataAuth(userId: number, dataPrivilegeData: DataPrivilegeData) {
  const requestArray: any[] = [];
  dataPrivilegeData.items.forEach((item) => {
    requestArray.push(classicAuth(userId, item));
  });
  const authValue = await Promise.all(requestArray);
  switch (dataPrivilegeData.rel) {
    case logic.and:
      if (!authValue.every((res) => res)) {
        logger.error("[DataPrivilege] auth fail");
        throw new customException("[DataPrivilege] auth fail");
      }
      break;

    case logic.or:
      if (!authValue.some((res) => res)) {
        logger.error("[DataPrivilege] auth fail");
        throw new customException("[DataPrivilege] auth fail");
      }
      break;
    default:
      logger.error(`[DataPrivilege] the rel type only support: and, or`);
      throw new customException("[DataPrivilege] the rel type only support: and, or", "-1");
  }
}
