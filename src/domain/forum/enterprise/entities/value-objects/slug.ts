export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(text: string) {
    return new Slug(text)
  }

  /**
   * Recives a string and normalize it as a slug
   *
   * Example:
   *  input: "An example title"
   *  output: "an-example-title"
   *
   *
   * @param text {string}
   */
  static createFromText(text: string) {
    const slug = text
      .normalize('NFKD')
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slug)
  }
}
