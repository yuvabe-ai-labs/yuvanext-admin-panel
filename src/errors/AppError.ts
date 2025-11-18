
export class Unauthorized extends Error {
  statusCode?: number;
  details?: any;
  code?: string;

  constructor(message: string, statusCode?: number, details?: any) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    // If the third param is a string, treat it as a machine-readable code
    if (typeof details === "string") {
      this.code = details;
    }
  }
}