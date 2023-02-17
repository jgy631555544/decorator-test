import axios from "../utils/axios";
import { Api } from "../consts/api";
import { getOceanBaseObjectType } from "../consts/hierarchyType";
import customException from "../exception";
import { logic } from "../consts/logic";
import { PrivilegeItem, DataPrivilegeData } from "../consts/types";
import logger from "../utils/logger";

function oceanbaseAuth(userId: number, privilegeItem: PrivilegeItem): Promise<boolean> {
  const oceanbaseHost: string = process.env.OCEANBASE_AUTH_HOST as string;
  const oceanbaseUrl: string = oceanbaseHost + Api.oceanbase;
  try {
    return axios
      .post(
        oceanbaseUrl,
        JSON.stringify({
          userIds: [userId],
          objectIds: [privilegeItem.id],
          objectType: getOceanBaseObjectType(privilegeItem.type)
        })
      )
      .then((res: any) => {
        const data = res.data;
        logger.info(`[DataPrivilege] response is ${JSON.stringify(data)}`);
        if (data.error === "0") {
          if (data.result) {
            logger.info(`[DataPrivilege] ${privilegeItem.id} auth success`);
            return true;
          } else {
            logger.info(`[DataPrivilege] ${privilegeItem.id} auth fail`);
            return false;
          }
        } else {
          logger.error(`[DataPrivilege] oceanbase throw error: ${data.error}`);
          throw new customException(`[DataPrivilege] oceanbase throw error: ${data.error}`);
        }
      });
  } catch (e) {
    return Promise.resolve(false);
  }
}

export default async function oceanbaseDataAuth(userId: number, dataPrivilegeData: DataPrivilegeData) {
  const requestArray: any[] = [];
  dataPrivilegeData.items.forEach((item) => {
    requestArray.push(oceanbaseAuth(userId, item));
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
