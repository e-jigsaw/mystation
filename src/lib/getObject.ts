import { client } from "./getClient";

export const getObject = (bucket: string, prefix: string) => {
  return new Promise(async (resolve, reject) => {
    let data = "";
    try {
      const str = await client.getObject(bucket, prefix);
      str.on("data", (chunk) => {
        data += chunk;
      });
      str.on("end", () => {
        resolve(JSON.parse(data));
      });
      str.on("error", (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};
