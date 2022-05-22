export class SymbolUtility {
    generateSymbolFromSentence(sentence: String) {
        const arrayOfWords = sentence.split(" ");
        if(!arrayOfWords) return;
        if(arrayOfWords.length == 1) {
            if(arrayOfWords[0].length < 2) return arrayOfWords[0][0];
            if(arrayOfWords[0].length < 3) return arrayOfWords[0][0] + arrayOfWords[0][1];
            return arrayOfWords[0][0]+ arrayOfWords[0][1]+ arrayOfWords[0][2] + arrayOfWords[0][3]
        }else if(arrayOfWords.length == 2) {
            return arrayOfWords[0][0]+ arrayOfWords[0][1]+ arrayOfWords[0][2] + arrayOfWords[0][3]
        }else {

        }
    }

}