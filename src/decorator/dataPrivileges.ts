import { checkParams, DataPrivilegeData, multipleHierachyParams } from "../consts/types";
import { checkType } from "../consts/checkType";
import { logic } from "../consts/logic";
import logger from "../utils/logger";
import customException from "../exception";
import oceanbaseDataAuth from "../auth/oceanbase";
import classicDataAuth from "../auth/classic";
import getId from "../utils/getId";

function dataPrivilegeDecorators(multipleHierachyParams: multipleHierachyParams, params?: checkParams): any {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any) {
      const {
        type = checkType.oceanbase,
        rel = logic.and,
        hasDataAuth = () => {
          logger.error("[DataPrivilege] when checkType equal custom, need hasDataAuth function");
          throw new customException("[DataPrivilege] when checkType equal custom, need hasDataAuth function", "-1");
        }
      } = params || {};
      logger.info("[DataPrivilege] login dataPrivilegeDecorator");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const userId = this?.context?.session?.get("id") || this?.context?.user?.id;
      logger.info(`[DataPrivilege] userId = ${userId}`);
      if (!userId) {
        logger.error("[DataPrivilege] please provide the current user id", "-1");
        throw new customException("[DataPrivilege] please provide the current user id", "-1");
      }
      logger.info("[DataPrivilege] the current user id is ：%s", userId);
      const dataPrivilegeData: DataPrivilegeData = {
        items: multipleHierachyParams.map((item) => ({
          id: getId(args[0], item.key),
          ...item
        })),
        rel
      };
      switch (type) {
        case checkType.oceanbase:
          await oceanbaseDataAuth(userId, dataPrivilegeData);
          break;
        case checkType.classic:
          await classicDataAuth(userId, dataPrivilegeData);
          break;
        case checkType.custom:
          if (await hasDataAuth(userId, dataPrivilegeData)) {
            logger.info("[DataPrivilege] auth success");
          } else {
            logger.error("[DataPrivilege] auth fail");
            throw new customException("[DataPrivilege] auth fail");
          }
          break;
        default:
          logger.error("[DataPrivilege] the checkType only support: oceanbase, classic and customer");
          throw new customException("[DataPrivilege] the checkType only support: oceanbase, classic and customer");
      }
      return originalMethod.apply(this, args);
    };
  };
}

export default dataPrivilegeDecorators;
