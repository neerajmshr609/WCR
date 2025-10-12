export class Language {
  name: string;

  get renderChipName() {
    return this.name;
  }
}

export const createLanguage = (src: string) => {
  const language = new Language();
  language.name = src;
  return language;
};