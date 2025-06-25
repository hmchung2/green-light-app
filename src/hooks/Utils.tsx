export const calculateAge = (birthTimeStamp: string | undefined) => {
  if (birthTimeStamp === undefined) {
    return '???';
  }
  const birthDate = new Date(parseInt(birthTimeStamp, 10));
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const getDateFromUnixTime = (unixTimeStamp: string | undefined) => {
  if (unixTimeStamp === undefined) {
    return '???';
  }
  const date = new Date(parseInt(unixTimeStamp, 10));
  // working on this
  return null;
};
