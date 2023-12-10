import { client } from "lib/getClient";

const main = async () => {
  const stream = client.listObjectsV2(
    process.env.MINIO_BUCKET!,
    "output/",
    true
  );
  stream.on("data", async (obj) => {
    if (obj.name) {
      const [_, prefix, name] = obj.name?.split("/") ?? [];
      if (name === "meta.json") {
        client.getObject(process.env.MINIO_BUCKET!, obj.name, (err, str) => {
          let s = "";
          str.on("data", (chunk) => (s += chunk));
          str.on("end", () => {
            // insert title
            if (JSON.parse(s).title === "") {
              client.fGetObject(
                process.env.MINIO_BUCKET!,
                obj.name,
                `./tmp/${prefix}/meta.json`
              );
              client.fGetObject(
                process.env.MINIO_BUCKET!,
                `output/${prefix}/a.mp3`,
                `./tmp/${prefix}/a.mp3`
              );
            }
          });
        });
      }
    }
  });
};

main();
