import dns from "dns/promises";
import axios from "axios";

export class NetworkService {
  static async hasInternetAccess(): Promise<boolean> {
    try {
      await dns.lookup("google.com");
      return true;
    } catch {
      return false;
    }
  }

  static async canReachInternet(): Promise<boolean> {
    try {
      await axios.get("https://clients3.google.com/generate_204", {
        timeout: 5000,
      });
      return true;
    } catch {
      return false;
    }
  }

  static async isOnline(): Promise<boolean> {
    const dnsOk = await this.hasInternetAccess();
    if (!dnsOk) return false;
    return await this.canReachInternet();
  }
}
