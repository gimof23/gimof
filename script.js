document.addEventListener('DOMContentLoaded', (event) => {
    const startBtn = document.getElementById('start-btn');
    const result = document.getElementById('result');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionUS = new SpeechRecognition();
    const recognitionGB = new SpeechRecognition();
    
    recognitionUS.lang = 'en-US';
    recognitionUS.interimResults = true;
    recognitionUS.continuous = true;

    recognitionGB.lang = 'en-GB';
    recognitionGB.interimResults = true;
    recognitionGB.continuous = true;

    let isRecording = false;
    let finalTranscript = '';
    let interimTranscript = '';

    const startRecognition = () => {
        result.textContent = '';
        finalTranscript = '';
        interimTranscript = '';
        recognitionUS.start();
        recognitionGB.start();
        startBtn.textContent = 'Nagrywanie... Kliknij ponownie, aby zakończyć';
        startBtn.classList.add('recording');
        isRecording = true;
    };

    const stopRecognition = () => {
        recognitionUS.stop();
        recognitionGB.stop();
        startBtn.textContent = 'Rozpocznij nagrywanie';
        startBtn.classList.remove('recording');
        isRecording = false;
    };

    startBtn.addEventListener('click', () => {
        if (!isRecording) {
            startRecognition();
        } else {
            stopRecognition();
        }
    });

    const handleResult = (event) => {
        interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                let finalResult = event.results[i][0].transcript.trim();
                finalResult = capitalizeFirstWord(finalResult);
                finalResult = correctCommonMistakes(finalResult);
                finalResult = handlePolishCityNames(finalResult);
                finalResult = addPunctuation(finalResult);
                finalTranscript += finalResult + ' ';
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        result.textContent = finalTranscript + interimTranscript;
    };

    const capitalizeFirstWord = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const correctCommonMistakes = (text) => {
        const commonMistakes = {
            "matt": "met",
            "whats": "what's",
            "its": "it's",
            "theres": "there's",
            "ill": "I'll",
            "wont": "won't",
            "cant": "can't",
            "ive": "I've",
            "dont": "don't",
            "didnt": "didn't",
            "isnt": "isn't",
            "arent": "aren't",
            "wasnt": "wasn't",
            "werent": "weren't",
            "hasnt": "hasn't",
            "havent": "haven't",
            "shouldnt": "shouldn't",
            "wouldnt": "wouldn't",
            "couldnt": "couldn't",
            "mustnt": "mustn't",
            "shant": "shan't",
            "neednt": "needn't",
            "maynt": "mayn't",
            "mightnt": "mightn't",
            "oughtnt": "oughtn't",
            "darent": "daren't",
            "wanna": "wanna",
            "gonna": "gonna",
            "gotta": "gotta",
            "ain't": "ain't",
            "coulda": "coulda",
            "woulda": "woulda",
            "shoulda": "shoulda",
            "mighta": "mighta",
            "musta": "musta",
            "kinda": "kinda",
            "sorta": "sorta",
            "outta": "outta",
            "lotta": "lotta",
            "lemme": "lemme",
            "gimme": "gimme",
            "innit": "innit",
            "y'all": "y'all",
            "dunno": "dunno",
            "gotcha": "gotcha",
            "betcha": "betcha",
            "cuppa": "cuppa",
            "d'you": "d'you",
            "how're": "how're",
            "there're": "there're",
            "where're": "where're",
            "who're": "who're",
            "whatcha": "whatcha",
            "g'day": "g'day",
            "b'day": "b'day",
            "o'clock": "o'clock",
            "y'know": "y'know",
            "y'gotta": "y'gotta",
            "c'mon": "c'mon",
            "aight": "aight",
            "bro": "bro",
            "cuz": "cuz",
            "fam": "fam",
            "gr8": "gr8",
            "l8r": "l8r",
            "omw": "omw",
            "plz": "plz",
            "smh": "smh",
            "tho": "tho",
            "thx": "thx",
            "u": "u",
            "ur": "ur",
            "ya": "ya",
            "w/": "w/",
            "w/o": "w/o",
            "b4": "b4",
            "b/c": "b/c",
            "idk": "idk",
            "ikr": "ikr",
            "imo": "imo",
            "omg": "omg",
            "rofl": "rofl",
            "tbh": "tbh",
            "ttyl": "ttyl",
            "wyd": "wyd",
            "yolo": "yolo",
            "wtf": "wtf",
            "brb": "brb",
            "ftw": "ftw",
            "fyi": "fyi",
            "irl": "irl",
            "jk": "jk",
            "np": "np",
            "wtg": "wtg",
            "afk": "afk",
            "atm": "atm",
            "bff": "bff",
            "bfn": "bfn",
            "cya": "cya",
            "diy": "diy",
            "faq": "faq",
            "fomo": "fomo",
            "ftl": "ftl",
            "gtg": "gtg",
            "hmu": "hmu",
            "j/k": "j/k",
            "lmk": "lmk",
            "lol": "lol",
            "lmao": "lmao",
            "nvm": "nvm",
            "omw": "omw",
            "rsvp": "rsvp",
            "tba": "tba",
            "tbd": "tbd",
            "tia": "tia",
            "tmi": "tmi",
            "w/e": "w/e",
            "w/o": "w/o",
            "wth": "wth",
            "wtf": "wtf",
            "wyd": "wyd",
            "yolo": "yolo",
            "yo": "yo",
            "sup": "sup",
            "howdy": "howdy",
            "greetings": "greetings",
            "hi": "hi",
            "hey": "hey",
            "hola": "hola",
            "salutations": "salutations",
            "goodbye": "goodbye",
            "farewell": "farewell",
            "see ya": "see ya",
            "later": "later",
            "peace": "peace",
            "take care": "take care",
            "catch you later": "catch you later",
            "goodnight": "goodnight",
            "gn": "gn",
            "good morning": "good morning",
            "gm": "gm",
            "good afternoon": "good afternoon",
            "ga": "ga",
            "how are you": "how are you",
            "how's it going": "how's it going",
            "what's new": "what's new",
            "what's going on": "what's going on",
            "what's up": "what's up",
            "how's everything": "how's everything",
            "how's life": "how's life",
            "how are things": "how are things",
            "what's good": "what's good",
            "how's life treating you": "how's life treating you",
            "long time no see": "long time no see",
            "it's been a while": "it's been a while",
            "no problem": "no problem",
            "no worries": "no worries",
            "don't mention it": "don't mention it",
            "my pleasure": "my pleasure",
            "anytime": "anytime",
            "sure thing": "sure thing",
            "glad to help": "glad to help",
            "happy to help": "happy to help",
            "good evening": "good evening",
            "ge": "ge",
            "good day": "good day",
            "gd": "gd",
            "what's cracking": "what's cracking",
            "what's popping": "what's popping",
            "yo": "yo",
            "g'day": "g'day",
            "cheers": "cheers",
            "ta": "ta",
            "much obliged": "much obliged",
            "thanks a bunch": "thanks a bunch",
            "thanks a lot": "thanks a lot",
            "thank you very much": "thank you very much",
            "thanks so much": "thanks so much",
            "many thanks": "many thanks",
            "thanks a million": "thanks a million",
            "appreciate it": "appreciate it",
            "greatly appreciated": "greatly appreciated",
            "thanks in advance": "thanks in advance",
            "thank you": "thank you",
            "much appreciated": "much appreciated",
            "I appreciate it": "I appreciate it",
            "thanks a ton": "thanks a ton",
            "big thanks": "big thanks",
            "thanks heaps": "thanks heaps",
            "thanks a bundle": "thanks a bundle",
            "thanks so very much": "thanks so very much",
            "I owe you one": "I owe you one",
            "you rock": "you rock",
            "you're the best": "you're the best",
            "bless you": "bless you",
            "thankful": "thankful",
            "grateful": "grateful",
            "appreciative": "appreciative",
            "obliged": "obliged",
            "indebted": "indebted",
            "I'm obliged": "I'm obliged",
            "I thank you": "I thank you",
            "thank you kindly": "thank you kindly",
            "appreciate": "appreciate",
            "gracias": "gracias",
            "danke": "danke",
            "merci": "merci",
            "grazie": "grazie",
            "arigato": "arigato",
            "xie xie": "xie xie",
            "dhanyavad": "dhanyavad",
            "shukran": "shukran",
            "kamsahamnida": "kamsahamnida",
            "spasibo": "spasibo",
            "tack": "tack",
            "takk": "takk",
            "kiitos": "kiitos",
            "obrigado": "obrigado",
            "acknowledge": "acknowledge",
            "praise": "praise",
            "commend": "commend",
            "pay tribute": "pay tribute",
            "give thanks": "give thanks",
            "express gratitude": "express gratitude",
            "show appreciation": "show appreciation",
            "honor": "honor",
            "recognize": "recognize",
            "give credit": "give credit",
            "thank": "thank",
            "acknowledge with thanks": "acknowledge with thanks"
            // Dodaj inne typowe błędy i ich poprawki tutaj
        };

        const words = text.split(' ');
        return words.map(word => commonMistakes[word.toLowerCase()] || word).join(' ');
    };

    const handlePolishCityNames = (text) => {
        const polishCities = ["Warszawa", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Białystok", "Katowice", "Gdynia", "Częstochowa", "Radom", "Toruń", "Sosnowiec", "Kielce", "Rzeszów", "Gliwice", "Zabrze", "Olsztyn", "Bielsko-Biała", "Bytom", "Zielona Góra", "Rybnik", "Ruda Śląska", "Opole", "Tarnów", "Chorzów", "Koszalin", "Legnica", "Grudziądz", "Słupsk", "Jaworzno", "Jastrzębie-Zdrój", "Nowy Sącz", "Jelenia Góra", "Konin", "Piła", "Lubin", "Inowrocław", "Ostrowiec Świętokrzyski", "Gniezno", "Suwałki", "Głogów", "Siemianowice Śląskie", "Pabianice", "Tarnobrzeg", "Piotrków Trybunalski", "Bełchatów", "Świdnica", "Biała Podlaska", "Żory", "Świętochłowice", "Chełm", "Przemyśl", "Tarnobrzeg", "Piekary Śląskie", "Ostrowiec Świętokrzyski", "Zamość", "Kędzierzyn-Koźle", "Stalowa Wola", "Łomża", "Leszno", "Mielec", "Tomaszów Mazowiecki", "Łowicz", "Lubartów", "Nysa", "Mysłowice", "Mikołów", "Augustów", "Ostrów Wielkopolski", "Starachowice", "Turek", "Sanok", "Skierniewice", "Świdnik", "Kołobrzeg", "Dębica", "Sandomierz", "Łęczna", "Świebodzin", "Łazy", "Puławy", "Krosno", "Wejherowo", "Starogard Gdański", "Żyrardów", "Siedlce", "Lębork", "Lubań", "Człuchów", "Polkowice", "Malbork", "Kłodzko", "Sieradz", "Nowa Sól", "Żagań", "Świnoujście", "Wałcz", "Września", "Oława", "Brzeg", "Kościan", "Sokołów Podlaski", "Grajewo", "Wyszków", "Środa Wielkopolska", "Mińsk Mazowiecki", "Żary", "Wągrowiec", "Gostyń", "Ostrołęka", "Międzyrzecz", "Łuków", "Kozienice", "Oława", "Skarżysko-Kamienna", "Pułtusk", "Goleniów", "Limanowa", "Jasło", "Kraśnik", "Ostrowiec Świętokrzyski", "Nowy Targ", "Siedlce", "Szczytno", "Racibórz", "Łęczna", "Cieszyn", "Ełk", "Świdnik", "Giżycko", "Kętrzyn", "Tarnogród"]; // Add other cities as needed

        const words = text.split(' ');
        return words.map(word => {
            if (polishCities.includes(word)) {
                return word;
            } else {
                return word;
            }
        }).join(' ');
    };

    const addPunctuation = (text) => {
        if (isQuestion(text)) {
            return text + '?';
        } else {
            return text + '.';
        }
    };

    const isQuestion = (text) => {
        const questionWords = [
            'is', 'are', 'do', 'does', 'what', 'why', 'how', 'where', 'when', 'who',
            'which', 'can', 'could', 'would', 'should', 'shall', 'will', 'have', 'has',
            'did', 'does', 'am', 'was', 'were', 'may', 'might', 'must', 'should', 'shall',
            'and', 'or', 'nor', 'but', 'yet', 'so', 'and you', 'could you', 'would you',
            'can you', 'do you', 'did you', 'have you', 'has anyone', 'what is', 'how is',
            'who is', 'where is', 'why is', 'which is', 'shall we', 'should we', 'can we',
            'do we', 'did we', 'are we', 'were we', 'was there', 'is there', 'does anyone',
            'why do', 'what do', 'how do', 'where do', 'when do', 'who do', 'which do',
            'aren\'t you', 'can I', 'can we', 'can\'t we', 'could I', 'could we', 'couldn\'t we',
            'did they', 'didn\'t they', 'do they', 'don\'t they', 'does it', 'does he', 'does she',
            'doesn\'t it', 'doesn\'t he', 'doesn\'t she', 'have they', 'haven\'t they', 'how are',
            'is it', 'isn\'t it', 'should I', 'should we', 'shouldn\'t I', 'shouldn\'t we',
            'what about', 'what are', 'what can', 'what did', 'what do', 'what does', 'what if',
            'what is', 'what makes', 'what time', 'what\'s up', 'when are', 'when can', 'when did',
            'when do', 'when does', 'when is', 'where are', 'where can', 'where did', 'where do',
            'where does', 'where is', 'who are', 'who can', 'who did', 'who do', 'who does',
            'who is', 'who will', 'why are', 'why can', 'why did', 'why do', 'why does', 'why is',
            'why should', 'will it', 'will we', 'won\'t they', 'won\'t we', 'wouldn\'t they',
            'wouldn\'t we', 'how come', 'is anybody', 'is everyone', 'could anyone', 'is anything',
            'could anything', 'are you', 'what\'s up'
        ];
        const questionPhrases = [
            "what's up", "right", "isn't it", "don't you think", "do you agree", "aren't you", "won't you",
            "is it", "is this", "are you", "do you", "did you", "could you", "would you", "should you",
            "have you", "has anyone", "might you", "will you", "can you", "won't you", "isn't it", "could it be",
            "should it be", "would it be", "might it be", "must it be", "is it not", "do you not think",
            "do you not agree", "isn't that right", "isn't it true", "don't you agree", "wouldn't you say"
        ];
        
        const lowerText = text.toLowerCase();
        
        // Special check for "right now"
        if (lowerText.includes("right now")) {
            return false;
        }

        if (questionWords.some(word => lowerText.startsWith(word))) {
            return true;
        }
        
        return questionPhrases.some(phrase => lowerText.includes(phrase));
    };

    recognitionUS.addEventListener('result', handleResult);
    recognitionGB.addEventListener('result', handleResult);

    recognitionUS.addEventListener('error', (event) => {
        result.textContent = `Wystąpił błąd (US): ${event.error}`;
        stopRecognition();
    });

    recognitionGB.addEventListener('error', (event) => {
        result.textContent = `Wystąpił błąd (GB): ${event.error}`;
        stopRecognition();
    });
});
