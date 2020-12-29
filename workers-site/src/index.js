import {
  getAssetFromKV,
  mapRequestToAsset,
} from "@cloudflare/kv-asset-handler";

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = true;


addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        })
      );
    }
    event.respondWith(new Response("Internal Error", { status: 500 }));
  }
});

async function handleEvent(event) {
  const url = new URL(event.request.url);
  let options = {};

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  // options.mapRequestToAsset = handlePrefix(/^\/docs/)

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      };
    }
    if (event.request.method === 'PUT') {
      return updateKV(event.request)
    }
    console.log("handleEvent", event.request.method);
    // console.log(event.request);
    let asset = await getAssetFromKV(event, options);
    // console.log(">>>>", asset, "<<<<<");
    return await getAssetFromKV(event, options);
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: (req) =>
            new Request(`${new URL(req.url).origin}/404.html`, req),
        });

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 404,
        });
      } catch (e) { }
    }

    return new Response(e.message || e.toString(), { status: 500 });
  }
}

/**
 * Here's one example of how to modify a request to
 * remove a specific prefix, in this case `/docs` from
 * the url. This can be useful if you are deploying to a
 * route on a zone, or if you only want your static content
 * to exist at a specific path.
 */
function handlePrefix(prefix) {
  return (request) => {
    // compute the default (e.g. / -> index.html)
    let defaultAssetKey = mapRequestToAsset(request);
    let url = new URL(defaultAssetKey.url);

    // strip the prefix from the path for lookup
    url.pathname = url.pathname.replace(prefix, "/");

    // inherit all other props from the default request
    return new Request(url.toString(), defaultAssetKey);
  };
}

const defaultData = { todos: [] }

// TODOS2 is a Cloudflare KV Namespaces binding in wrangler.toml
const setCache = (key, data) => TODOS2.put(key, data)
const getCache = key => TODOS2.get(key)

/// Retrieve the Key/Value based on the request
/// This will be a JSON struct
async function getKV(request) {
  const ip = request.headers.get('CF-Connecting-IP')
  const cacheKey = `foo-${ip}`
  let json_struct
  const cache = await getCache(cacheKey)
  if (!cache) {
    await setCache(cacheKey, JSON.stringify(defaultData))
    json_struct = defaultData
  } else {
    json_struct = JSON.parse(cache)
  }
  return json_struct; // a parsed JSON object (not a string)
}

async function updateKV(request) {
  //console.log("{'updateKVX': 'boo'}")
  const body = await request.text()
  const ip = request.headers.get('CF-Connecting-IP')
  const cacheKey = `foo-${ip}`
  try {
    console.log("updateKV")
    console.log(body)
    console.log("--------")
    JSON.parse(body) // confirm the body is valid stringified JSON 
    await setCache(cacheKey, body)
    return new Response(body, { status: 200 })
  } catch (err) {
    return new Response(err, { status: 500 })
  }
}

