/**
 * 取得指定静态资源
 * @param {string} val
 */
export function getPublicResourceUrl(val) {
  return `${process.env.BASE_URL}${val}`;
}

export function findResourceByRoute(resourceList, route, deep) {
  let targetResource = null;

  function findResourceByRouteName(rList, name, currentDeep, maxDeep) {
    const stepDeep = currentDeep + 1;
    return rList.some((item) => {
      if (stepDeep > maxDeep) {
        return false;
      }
      if (item.link === name) {
        targetResource = item;
        return true;
      }
      if (Array.isArray(item.children)) {
        return findResourceByRouteName(item.children, name, stepDeep, maxDeep);
      }
      return false;
    });
  }

  const routeTreeArray = [];
  route.matched.forEach((item) => {
    routeTreeArray.unshift(item);
  });
  routeTreeArray.some((r) => {
    if (findResourceByRouteName(resourceList, r.path, -1, deep)) {
      return true;
    }
    return false;
  });
  return targetResource;
}

export default {
  findResourceByRoute,
  getPublicResourceUrl,
};
