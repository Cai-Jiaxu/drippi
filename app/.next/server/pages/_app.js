const CHUNK_PUBLIC_PATH = "server/pages/_app.js";
const runtime = require("../chunks/ssr/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/ssr/8069e_@clerk_nextjs_dist_esm_app-router_client_keyless-creator-reader_cc34dd36.js");
runtime.loadChunk("server/chunks/ssr/node_modules_5de2f502._.js");
runtime.loadChunk("server/chunks/ssr/[root-of-the-server]__5aff3475._.js");
runtime.getOrInstantiateRuntimeModule("[project]/pages/_app.tsx [ssr] (ecmascript)", CHUNK_PUBLIC_PATH);
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/pages/_app.tsx [ssr] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
