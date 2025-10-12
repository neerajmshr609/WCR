export function ISODurationToSeconds(date: string) {
  const regex =
    /P(?:([.,\d]+)D)?(?:T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?)?/;
  const matches = date.match(regex);

  let res = 0;

  res += matches[1] ? +matches[1] * 86400 : 0;
  res += matches[2] ? +matches[2] * 3600 : 0;
  res += matches[3] ? +matches[3] * 60 : 0;
  res += matches[4] ? +matches[4] : 0;

  return res;
}
