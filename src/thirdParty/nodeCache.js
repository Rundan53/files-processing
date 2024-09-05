const nodeCache = require("node-cache");

const myCache = new nodeCache({ stdTTL: 3600 });

function fetchFromCache(cacheKey, page = 1) {
  if (myCache.has(cacheKey)) {
    const cachedTemplateData = myCache.get(cacheKey);
    const templateDataAtPage = cachedTemplateData[page];
    console.log("Getting Data From Cache", templateDataAtPage);

    return templateDataAtPage;
  }
}

function setOrUpdateCache(cacheKey, page = 1, newTemplateData) {
  if (myCache.has(cacheKey)) {
    const cachedTemplateData = myCache.get(cacheKey);
    cachedTemplateData[page] = newTemplateData;
    myCache.set(cacheKey, cachedTemplateData);
  } else {
    myCache.set(cacheKey, { [page]: newTemplateData });
  }
}

function deleteFromCache(prefixes) {
  const allCachekeys = myCache.keys();

  allCachekeys.forEach((key) => {
    prefixes.forEach((prefix) => {
      if (key.startsWith(prefix)) {
        myCache.del(key);
        console.log(`Deleted key: ${key}`);
      }
    });
  });
}

module.exports = {
  fetchFromCache,
  setOrUpdateCache,
  deleteFromCache,
};
