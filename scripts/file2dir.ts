import { prompt } from "@astrojs/cli-kit";

const glob = new Bun.Glob("./output/*.mp3");
for await (const file of glob.scan(".")) {
  const [_, __, filename] = file.split("/");
  const prefix = filename.split(".")[0];
  Bun.write(`./output/${prefix}/${filename}`, Bun.file(file));
  console.log(`${prefix}:`);
  const res = await prompt({
    name: "title",
    type: "text",
  });
  const [ft, id] = prefix.split("-");
  Bun.write(
    `./output/${prefix}/meta.json`,
    `{"ft":"${ft}","id":"${id}","title":"${res.title}"}`
  );
}
