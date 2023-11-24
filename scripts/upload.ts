import { client } from "lib/getClient";

const id = ""; // insert id

const main = async () => {
  const [meta, file] = await Promise.all([
    client.fPutObject(
      "mystation",
      `output/${id}/meta.json`,
      `./output/${id}/meta.json`
    ),
    client.fPutObject(
      "mystation",
      `output/${id}/a.mp3`,
      `./output/${id}/${id}.mp3`
    ),
  ]);
  console.log(meta, file);
};

main();
