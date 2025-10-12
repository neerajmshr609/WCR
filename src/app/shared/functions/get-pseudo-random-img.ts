export const getPseudoRandomImg = (baseInt = 1, imgList: string[]) => {
  const randomIndex = Number.isInteger(baseInt)
    ? baseInt % imgList.length
    : Math.floor(Math.random() * imgList.length);
  return imgList[randomIndex];
};
