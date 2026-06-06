export class ApiError extends Error {
  public statusCode?: number;
  public source: string;

  constructor(message: string, source: string, statusCode?: number) {
    super(message);
    this.name = "ApiError";
    this.source = source;
    this.statusCode = statusCode;
  }
}

export function handleApiError(error: unknown, source: string): string {
  if (error instanceof ApiError) {
    return `[${source}] Error: ${error.message} (Status: ${error.statusCode || "Unknown"})`;
  }
  if (error instanceof Error) {
    return `[${source}] Error: ${error.message}`;
  }
  return `[${source}] An unknown error occurred.`;
}
