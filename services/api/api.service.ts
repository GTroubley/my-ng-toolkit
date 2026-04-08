import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * ===========================================================================
 * 
 * Lightweight wrapper around Angular's HttpClient that appends the
 * API endpoint to the base URL from the environment config on every request.
 * All other services should use this instead of HttpClient directly
 * so the base URL is managed in a single place.
 * 
 * ===========================================================================
 */
@Injectable({
  providedIn: "root"
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl.replace(/\/$/, '');

  /**
   * Sends a GET request to the given endpoint.
   * @typeParam T - Expected shape of the response body.
   * @param endpoint - API path appended to the base URL.
   * @param params - Optional query parameters object.
   * @returns Observable emitting the parsed response of type T.
   */
  get<T>(endpoint: string, params?: Record<string, any>) {
    const httpParams = this.buildParams(params);
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params: httpParams });
  }

  /**
   * Sends a POST request to the given endpoint with a JSON body.
   * @typeParam T - Expected shape of the response body.
   * @param endpoint - API path appended to the base URL.
   * @param body - The request payload to be serialized as JSON.
   * @returns Observable emitting the parsed response of type T.
   */
  post<T>(endpoint: string, body: unknown) {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * Sends a PUT request to the given endpoint with a JSON body.
   * @typeParam T - Expected shape of the response body.
   * @param endpoint - API path appended to the base URL.
   * @param body - The request payload to be serialized as JSON.
   * @returns Observable emitting the parsed response of type T.
   */
  put<T>(endpoint: string, body: unknown) {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * Sends a DELETE request to the given endpoint.
   * @typeParam T - Expected shape of the response body.
   * @param endpoint - API path appended to the base URL.
   * @returns Observable emitting the parsed response of type T.
   */
  delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * Converts an object into HttpParams, filtering out null/undefined values.
   */
  private buildParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    if (!params) return httpParams;

    for (const key of Object.keys(params)) {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          for (const item of value) {
            httpParams = httpParams.append(key, item.toString());
          }
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    }

    return httpParams;
  }
}