import logger from "./logger";
import customException from "../exception";

function getId(params: any, key: string | undefined): string {
  if (!key) return params;
  const keySplit = key.split(".");
  let idItem = params;
  keySplit.forEach((str) => {
    idItem = idItem[str];
  });
  if (typeof idItem === "string" || typeof idItem === "number") {
    return `${idItem}`;
  } else {
    logger.error("[DataPrivilege] can not get hierarchyId by key from your params", "-1");
    throw new customException("[DataPrivilege] can not get hierarchyId by key from your params", "-1");
  }
}
export default getId;
