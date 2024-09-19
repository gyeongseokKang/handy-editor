export const getTimeLabel = (time: number) => {
  const float = (parseInt((time % 1) * 100 + "") + "").padStart(2, "0");
  const min = (parseInt(time / 60 + "") + "").padStart(2, "0");
  const second = (parseInt((time % 60) + "") + "").padStart(2, "0");

  return `${min}:${second}.${float.replace("0.", "")}`;
};
