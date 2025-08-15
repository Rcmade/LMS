import Mux from "@mux/mux-node";
import { config } from "dotenv";
config();

export const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});
