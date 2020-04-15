export default class APIError extends Error {
  constructor(public body: Record<string, any>, public status: number, message: string) {
    super(message);
  }
}
