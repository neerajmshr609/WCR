export const convertCountriesArray = (countriesArr: {
  [key: string]: string;
}) => {
  return Object.keys(countriesArr).map((key) => {
    return { code: key, name: countriesArr[key] };
  });
};
