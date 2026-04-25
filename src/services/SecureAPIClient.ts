import { getDeviceId } from "@/utils/deviceId";

export class SecureAPIClient {
  static async request(url: string, init: RequestInit) {
    const deviceId = await getDeviceId();
    const headers = new Headers(init.headers);
    headers.set("X-Grooted-Device", deviceId);
    return fetch(url, {
      ...init,
      headers,
    });
  }
}
