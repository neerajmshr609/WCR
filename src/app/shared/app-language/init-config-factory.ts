import { LanguageService } from '../../services/language.service';

export const translationConfigInitializeFactory = (
  languageService: LanguageService,
) => {
  return languageService.execAppInitConfig.bind(languageService);
};
