import { API_BASE } from "@/lib/config";

export interface ApiClientConfig {
	baseUrl: string;
	headers?: Record<string, string>;
}

class ApiClient {
	private readonly baseUrl: string;
	private readonly headers: Record<string, string>;

	constructor(config: ApiClientConfig) {
		this.baseUrl = config.baseUrl;
		this.headers = config.headers || {};
	}

	async get<T>(path: string): Promise<T> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			method: "GET",
			headers: this.headers,
		});
		if (!response.ok) {
			throw new Error(`API Error: ${response.status}`);
		}
		return response.json();
	}

	async post<T>(path: string, body: unknown): Promise<T> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			method: "POST",
			headers: { "Content-Type": "application/json", ...this.headers },
			body: JSON.stringify(body),
		});
		if (!response.ok) {
			throw new Error(`API Error: ${response.status}`);
		}
		return response.json();
	}

	async delete<T>(path: string): Promise<T> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			method: "DELETE",
			headers: this.headers,
		});
		if (!response.ok) {
			throw new Error(`API Error: ${response.status}`);
		}
		return response.json();
	}
}

export const apiClient = new ApiClient({ baseUrl: API_BASE });
