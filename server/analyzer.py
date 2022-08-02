import requests
import json
import nltk
import sys
from nltk.sentiment import SentimentIntensityAnalyzer
from statistics import mean

response = requests.get("http://localhost:3001/data")

comments = json.loads(response.text)

sia = SentimentIntensityAnalyzer()
stopwords = nltk.corpus.stopwords.words("english")

def analysis(text):
    negative = [
        sia.polarity_scores(sentence)['neg']
        for sentence in text
    ]
    neutral = [
        sia.polarity_scores(sentence)['neu']
        for sentence in text
    ]
    positive = [
        sia.polarity_scores(sentence)['pos']
        for sentence in text
    ]
    scores = [mean(negative) * 100, mean(neutral) * 100, mean(positive) * 100] 
    return scores

def is_positive(text) -> bool:
    scores = [
        sia.polarity_scores(sentence)["compound"]
        for sentence in text
    ]
    return mean(scores) >= 0.05

def common_words(text):
    tmp = []
    for sentence in text:
        words = sentence.split()
        tags = nltk.pos_tag(words)
        for word, tag in tags:
            if not word in stopwords and tag.startswith('JJ') and word.isalpha():
                tmp.append(word)
    finder = nltk.FreqDist(tmp)
    return finder.most_common(20)

def main(text):
    result = {}
    result["words"] = common_words(text)
    result["analysis"] = analysis(text)
    result["bool"] = is_positive(text)
    res = json.dumps(result)
    print(res)
    sys.stdout.flush()

if __name__ == "__main__":
    main(comments)



