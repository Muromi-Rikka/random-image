import { Elysia } from "elysia";
import { resolve } from "path"
import { cors } from '@elysiajs/cors'
import { readdirSync, existsSync } from "fs"
import sharp from "sharp"
const app = new Elysia().use(cors())
  .get("/:width/:height", ({ params, set }) => {
    set.headers = { "content-type": "image/webp" }
    return getFile(params)
  })
  .get("/*", ({  set }) => {
    set.headers = { "content-type": "image/webp" }
    return getFile()
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

async function getFile(size: { width?: string, height?: string } = {}) {
  const { width = 200, height = 200 } = size;
  const imagePath = resolve(process.cwd(), "./images");
  if (existsSync(imagePath)) {
    const imageList = readdirSync(imagePath);
    const imageFile = Bun.file(resolve(imagePath, imageList[Math.floor(Math.random() * imageList.length)]));
    const sharpImage = sharp(await imageFile.arrayBuffer());
    return sharpImage.resize(Number(width), Number(height)).webp().toBuffer()
  } else {
    return ""
  }
}