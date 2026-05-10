import { handleRequest } from "./server.js";

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  }
};
