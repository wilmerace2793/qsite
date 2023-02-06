export const getUrlParamValue = (url, param) => {
    const newUrl = new URL(url);
    const urlParams = newUrl.searchParams;
    return encodeURI(urlParams.get(param));
};
export const isFacebookVideo = (url) => {
    return url.includes("videos");
};
export const isFacebookPost = (url) => {
    return url.includes("post");
};
export const getInstagramId = (url) => {
    const splitUrl = url.split("/");
    console.log(splitUrl);
    const findReelOrPost = splitUrl.findIndex(string => string === 'reel' || string === 'p');
    if (findReelOrPost === -1) {
        iframe.textContent = "Type embed is not supported";
        return;
    }
    return splitUrl[findReelOrPost + 1];
};

export const availableUrls = {
    facebook: "https://www.facebook.com/",
    youtube: "https://www.youtube.com/",
    instagram: "https://www.instagram.com/",
};