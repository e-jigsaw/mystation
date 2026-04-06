import { client } from "lib/getClient";

const main = async () => {
  const glob = new Bun.Glob("./output/**/meta.json");
  for await (const file of glob.scan(".")) {
    const [_, __, prefix] = file.split("/");
    await client.fPutObject(
      process.env.MINIO_BUCKET!,
      `output/${prefix}/meta.json`,
      file
    );
    await client.fPutObject(
      process.env.MINIO_BUCKET!,
      `output/${prefix}/a.mp3`,
      `./output/${prefix}/a.mp3`
    );
  }
};

main();
