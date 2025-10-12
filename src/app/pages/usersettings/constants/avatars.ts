export const avatarsImages: string[] = [
  `/assets/avatars/1.svg`,
  `/assets/avatars/2.svg`,
  `/assets/avatars/3.svg`,
  `/assets/avatars/4.svg`,
  `/assets/avatars/5.svg`,
  // `/assets/avatars/6.svg`,
  `/assets/avatars/7.svg`,
  `/assets/avatars/8.svg`,
  `/assets/avatars/9.svg`,
  // `/assets/avatars/12.jpg`,
  // `/assets/avatars/13.jpg`,
  // `/assets/avatars/14.jpg`,
  // `/assets/avatars/15.jpg`,
  // `/assets/avatars/16.jpg`,
  // `/assets/avatars/17.jpg`,
  // `/assets/avatars/18.jpg`,
];

export const newAvatarsImages: string[] = [
  `/assets/avatars/smile_1.svg`,
  `/assets/avatars/smile_2.svg`,
  `/assets/avatars/smile_3.svg`,
  `/assets/avatars/smile_4.svg`,
  `/assets/avatars/smile_5.svg`,
  `/assets/avatars/smile_6.svg`,
  `/assets/avatars/smile_7.svg`,
  `/assets/avatars/smile_8.svg`,
];

export const getRandomAvatarSrc = (baseInt?: number) => {
  const randomIndex = Number.isInteger(baseInt)
    ? baseInt % newAvatarsImages.length
    : Math.floor(Math.random() * newAvatarsImages.length);
  return newAvatarsImages[randomIndex];
};
