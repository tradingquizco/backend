import { customAlphabet } from "nanoid";

const nanoId = customAlphabet("123456789", 6)

console.log(nanoId())