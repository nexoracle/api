interface Config {
  apiUrl: string;
  apiKey: string | null;
}

interface Params {
  [key: string]: any;
  apikey?: string;
}

interface ApiResponse {
  result?: any;
  [key: string]: any;
}

let config: Config = {
  apiUrl: "https://api.nexoracle.com",
  apiKey: null,
};

function setConfig({ apiUrl, apiKey }: { apiUrl?: string; apiKey?: string }): void {
  if (apiUrl) config.apiUrl = apiUrl;
  if (apiKey) config.apiKey = apiKey;
}

function apiParams(params: Params): Params {
  if (params.apikey) return params;
  if (config.apiKey) return { ...params, apikey: config.apiKey };
  return params;
}

const fetchApi = {
  async json(apiUrl: string, params: Params = {}, fetchResultOnly: boolean = false, method: "GET" | "POST" | "PUT" = "GET"): Promise<any> {
    try {
      let url = new URL(apiUrl);
      let options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
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

      const data = (await response.json()) as ApiResponse;

      if (fetchResultOnly) {
        if (data && data?.result) {
          return data.result;
        } else {
          return "No Result Found in API Response.";
        }
      } else {
        return data;
      }
    } catch (error: any) {
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

  async buffer(apiUrl: string, params: Params = {}, method: "GET" | "POST" | "PUT" = "GET"): Promise<any> {
    try {
      let url = new URL(apiUrl);
      let options: RequestInit = {
        method,
        headers: {},
      };

      if (method.toUpperCase() === "GET") {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      } else {
        options.headers = {
          "Content-Type": "application/json",
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
        const NodeBuffer = (globalThis as any).Buffer;

        return NodeBuffer ? NodeBuffer.from(arrayBuffer) : arrayBuffer;
      }
    } catch (error: any) {
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
  },
};

export { setConfig, apiParams, fetchApi, config };
