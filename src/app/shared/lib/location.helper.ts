export const getHostWithProtocol = () => {
  const { host, protocol } = location;
  return `${protocol}//${host}`;
};
