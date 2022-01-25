export const setToken = (loginKey, loginToken) => {
  const tokens = JSON.parse(localStorage.getItem("theCodeMeshTokens")) || {};
  tokens[loginKey] = loginToken;
  localStorage.setItem("theCodeMeshTokens", JSON.stringify(tokens));
};

export const getToken = () => {
  if (window && localStorage) return JSON.parse(localStorage.getItem("theCodeMeshTokens", {}));
  else return null;
};

export const updateQueryStringParameter = (uri, key, value) => {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf("?") !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, "$1" + key + "=" + value + "$2");
  } else {
    return uri + separator + key + "=" + value;
  }
};

export const errorHandler = (error, scope) => {
  if (error.response.data.code === 400 || error.response.data.code === 401) {
    const scopeKey = error.response?.data?.message?.scopeKey;
    let loginUrl = error.response?.data?.message?.loginUrl;
    console.log(scopeKey, loginUrl);
    if (scopeKey && scope) {
      //update with required scope here
      loginUrl = updateQueryStringParameter(loginUrl, scopeKey, scope);
    }
    if (loginUrl) {
      return loginUrl;
    } else {
      //silent fail to TheCodeMesh Errors
      console.log("TheCodeMesh integration failed, trace : ", error.response.data.message.trace);
      return -1;
    }
  }
  //silent fail to common errors
  console.log("TheCodeMesh integration failed, trace : ", error?.response?.data);
  return -1;
};
