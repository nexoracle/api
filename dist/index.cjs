"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/index.ts
var index_exports = {};
__export(index_exports, {
  apiParams: () => apiParams,
  config: () => config,
  downloader: () => downloader,
  fetchApi: () => fetchApi,
  imageProcessing: () => imageProcessing,
  islamic: () => islamic,
  setConfig: () => setConfig
});
module.exports = __toCommonJS(index_exports);

// lib/functions/index.ts
var config = {
  apiUrl: "https://api.nexoracle.com",
  apiKey: null
};
function setConfig({ apiUrl, apiKey }) {
  if (apiUrl) config.apiUrl = apiUrl;
  if (apiKey) config.apiKey = apiKey;
}
function apiParams(params) {
  if (params.apikey) return params;
  if (config.apiKey) return { ...params, apikey: config.apiKey };
  return params;
}
var fetchApi = {
  async json(apiUrl, params = {}, fetchResultOnly = false, method = "GET") {
    try {
      let url = new URL(apiUrl);
      let options = {
        method,
        headers: {
          "Content-Type": "application/json"
        }
      };
      if (method.toUpperCase() === "GET") {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      } else {
        options.body = JSON.stringify(params);
      }
      const response = await fetch(url.toString(), options);
      if (response.status === 302) {
        return "An Error Occurred";
      }
      const data = await response.json();
      if (fetchResultOnly) {
        if (data && data?.result) {
          return data.result;
        } else {
          return "No Result Found in API Response.";
        }
      } else {
        return data;
      }
    } catch (error) {
      console.error("[NexOracle APIs Error]:", error);
      if (fetchResultOnly) {
        if (error.response?.data && error.response?.data?.result) {
          return error.response.data.result;
        } else {
          return "No Result Found in API Response.";
        }
      } else {
        return error.response?.data || "No Result Found in API Response.";
      }
    }
  },
  async buffer(apiUrl, params = {}, method = "GET") {
    try {
      let url = new URL(apiUrl);
      let options = {
        method,
        headers: {}
      };
      if (method.toUpperCase() === "GET") {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      } else {
        options.headers = {
          "Content-Type": "application/json"
        };
        options.body = JSON.stringify(params);
      }
      const response = await fetch(url.toString(), options);
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await response.json();
        return data.result || "No Results Found";
      } else {
        const arrayBuffer = await response.arrayBuffer();
        const NodeBuffer = globalThis.Buffer;
        return NodeBuffer ? NodeBuffer.from(arrayBuffer) : arrayBuffer;
      }
    } catch (error) {
      console.error("[NexOracle APIs Error]:", error);
      if (error.response && error.response?.data) {
        try {
          const text = await new Response(error.response.data).text();
          const json = JSON.parse(text);
          return json.result || "No Results Found in API Response.";
        } catch {
          return "No Results Found in API Response.";
        }
      } else {
        return "No Results Found in API Response.";
      }
    }
  }
};

// lib/api/islamic.ts
var islamic = {
  alQuran: (params = {}) => fetchApi.buffer(`${config.apiUrl}/islamic/al-quran`, apiParams(params)),
  quranSurah: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/islamic/quran-surah`, apiParams(params), resultOnly),
  asmaUlHusna: (resultOnly = false) => fetchApi.json(`${config.apiUrl}/islamic/asma-ul-husna`, {}, resultOnly),
  prophetNames: (resultOnly = false) => fetchApi.json(`${config.apiUrl}/islamic/prophet-names`, {}, resultOnly),
  surahDetails: (resultOnly = false) => fetchApi.json(`${config.apiUrl}/islamic/surah-details`, {}, resultOnly),
  surahJuz: (resultOnly = false) => fetchApi.json(`${config.apiUrl}/islamic/surah-juz-details`, {}, resultOnly),
  surahVerse: (resultOnly = false) => fetchApi.json(`${config.apiUrl}/islamic/quran-surah-verses`, {}, resultOnly),
  prayerTimes: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/islamic/prayer-times`, apiParams(params), resultOnly),
  sahihAlBukhari: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/islamic/hadith-sahih-al-bukhari`, apiParams(params), resultOnly),
  hadithQudsi: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/islamic/hadith-qudsi`, apiParams(params), resultOnly),
  jamiAtTirmidhi: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/islamic/hadith-jami-at-tirmidhi`, apiParams(params), resultOnly),
  sunanAnNasai: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/islamic/hadith-sunan-nasai`, apiParams(params), resultOnly),
  sunanIbnMajah: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/islamic/hadith-ibn-majah`, apiParams(params), resultOnly),
  sunanAbuDawud: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/islamic/hadith-abu-dawud`, apiParams(params), resultOnly)
};

// lib/api/downloader.ts
var downloader = {
  apk: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/apk`, apiParams(params), resultOnly),
  aio1: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/aio1`, apiParams(params), resultOnly),
  aio2: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/aio2`, apiParams(params), resultOnly),
  aio3: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/aio3`, apiParams(params), resultOnly),
  biliBili: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/bilibili`, apiParams(params), resultOnly),
  capcut: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/capcut`, apiParams(params), resultOnly),
  douyin: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/douyin`, apiParams(params), resultOnly),
  dailyMotion: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/dailymotion`, apiParams(params), resultOnly),
  facebook: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/facebook`, apiParams(params), resultOnly),
  facebook2: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/facebook2`, apiParams(params), resultOnly),
  goFile: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/gofile`, apiParams(params), resultOnly),
  izLesene: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/izlesene`, apiParams(params), resultOnly),
  instagram: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/instagram`, apiParams(params), resultOnly),
  instagram2: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/instagram2`, apiParams(params), resultOnly),
  instagramStory: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/insta-story`, apiParams(params), resultOnly),
  googleDrive: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/gdrive`, apiParams(params), resultOnly),
  Likee: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/likee`, apiParams(params), resultOnly),
  linkedin: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/linkedin`, apiParams(params), resultOnly),
  mediaFire: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/media-fire`, apiParams(params), resultOnly),
  okRu: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/ok.ru`, apiParams(params), resultOnly),
  pixelDrain: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/pixeldrain`, apiParams(params), resultOnly),
  rumble: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/rumble`, apiParams(params), resultOnly),
  reddit: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/reddit`, apiParams(params), resultOnly),
  ringtone: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/ringtone`, apiParams(params), resultOnly),
  soundCloud: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/sound-cloud`, apiParams(params), resultOnly),
  soundEffects: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/sound-effect`, apiParams(params), resultOnly),
  nineGag: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/9gag`, apiParams(params), resultOnly),
  spotify: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/spotify`, apiParams(params), resultOnly),
  snackVideo: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/snack-video`, apiParams(params), resultOnly),
  smule: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/smule`, apiParams(params), resultOnly),
  shareChat: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/sharechat`, apiParams(params), resultOnly),
  snapChat: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/snapchat`, apiParams(params), resultOnly),
  terabox: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/terabox`, apiParams(params), resultOnly),
  tiktokNoWM: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/tiktok-nowm`, apiParams(params), resultOnly),
  tiktokMusic: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/tiktok-music`, apiParams(params), resultOnly),
  tiktokWM: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/tiktok-wm`, apiParams(params), resultOnly),
  tiktokNoWM2: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/tiktok-nowm2`, apiParams(params), resultOnly),
  tiktokImages: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/tiktok-photo`, apiParams(params), resultOnly),
  threads: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/threads`, apiParams(params), resultOnly),
  twitter: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/twitter`, apiParams(params), resultOnly),
  videy: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/videy`, apiParams(params), resultOnly),
  vimeo: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/vimeo`, apiParams(params), resultOnly),
  waMod: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/wamod`, apiParams(params), resultOnly),
  youtubeVideo: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/yt-video`, apiParams(params), resultOnly),
  youtubeVideo2: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/yt-video2`, apiParams(params), resultOnly),
  youtubeSearch: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/yt-search`, apiParams(params), resultOnly),
  youtubeAudio: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/yt-audio`, apiParams(params), resultOnly),
  youtubeAudio2: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/yt-audio2`, apiParams(params), resultOnly),
  youtubePlay: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/yt-play`, apiParams(params), resultOnly),
  youtubePlay2: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/insta-story`, apiParams(params), resultOnly),
  whatsappStory: (params = {}, resultOnly = false) => fetchApi.json(`${config.apiUrl}/downloader/whatsapp-story`, apiParams(params), resultOnly)
};

// lib/api/image-processing.ts
var imageProcessing = {
  ad: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/ad`, apiParams(params)),
  artify: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/artify`, apiParams(params)),
  beautiful: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/beautiful`, apiParams(params)),
  blur: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/blur`, apiParams(params)),
  clown: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/clown`, apiParams(params)),
  darkness: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/darkness`, apiParams(params)),
  dehaze: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/dehaze`, apiParams(params)),
  drip: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/drip`, apiParams(params)),
  enhance: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/enhance`, apiParams(params)),
  facePalm: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/face-palm`, apiParams(params)),
  greyScale: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/greyscale`, apiParams(params)),
  gunOverLay: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/gun-overlay`, apiParams(params)),
  image2Gta: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/image2gta`, apiParams(params)),
  image2Anime: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/image2anime`, apiParams(params)),
  iphoneAlert: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/fake-alert`, apiParams(params)),
  invert: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/invert`, apiParams(params)),
  jail: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/jail`, apiParams(params)),
  mnm: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/mnm`, apiParams(params)),
  pet: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/pet`, apiParams(params)),
  pixelate: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/pixelate`, apiParams(params)),
  removeBG: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/remove-bg`, apiParams(params)),
  rip: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/rip`, apiParams(params)),
  rainbow: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/rainbow`, apiParams(params)),
  recolor: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/recolor`, apiParams(params)),
  resize: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/resize`, apiParams(params)),
  trigger: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/trigger`, apiParams(params)),
  upscale: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/upscale`, apiParams(params)),
  wasted: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/wasted`, apiParams(params)),
  wanted: (params = {}) => fetchApi.buffer(`${config.apiUrl}/image-processing/wanted`, apiParams(params))
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  apiParams,
  config,
  downloader,
  fetchApi,
  imageProcessing,
  islamic,
  setConfig
});
