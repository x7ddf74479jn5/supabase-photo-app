// photos/userId/photoKey -> userId/photoKey
export const removeBucketPath = (key: string, bucketName: string) => {
  return key.slice(bucketName.length + 1);
};
