export default async function bundle() {
  const p = Deno.run({
    cmd: [
      "deno",
      "bundle",
      // "--unstable",
      // "--importmap=app/import_map.json",
      "../index.ts",
      "../mod.js",
    ],
  });

  return p.status();
}
