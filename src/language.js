import strings from './strings'
import detectBrowserLanguage from "detect-browser-language";

let language = function (){

    const languages = ['nl', 'en', 'fr', 'de'];
    let lang = detectBrowserLanguage().substring(0, 2);
    if (!languages.includes(lang)) {
        lang = 'nl'
    }
    strings.setLanguage(lang);
    return lang;
}

export default language
