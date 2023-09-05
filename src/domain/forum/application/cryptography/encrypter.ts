export abstract class Enctrypter {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
