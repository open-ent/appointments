export const displaySize = (sizeInOctets: number) => {
  if (sizeInOctets === 0) return 0;
  const sizeInMo = sizeInOctets / 1024 / 1024;
  if (sizeInMo < 0.01) {
    return sizeInMo.toFixed(3);
  }
  if (sizeInMo < 10) {
    return sizeInMo.toFixed(2);
  }
  return sizeInMo.toFixed(1);
};
