from whoosh.analysis import RegexTokenizer, LowercaseFilter, StopFilter, Filter
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory

# Custom Filter for Indonesian Stemming using Sastrawi
class IndonesianStemFilter(Filter):
    def __init__(self):
        factory = StemmerFactory()
        self.stemmer = factory.create_stemmer()
    
    def __call__(self, tokens):
        for t in tokens:
            t.text = self.stemmer.stem(t.text)
            yield t

# Indonesian Stopwords List
ID_STOPWORDS = frozenset([
    'yang', 'di', 'dari', 'dan', 'tersebut', 'ke', 'ini', 'itu', 'adalah', 'itu', 
    'untuk', 'dengan', 'pada', 'juga', 'oleh', 'bahwa', 'seperti', 'ia', 'dalam', 
    'saya', 'kami', 'kita', 'mereka', 'anda', 'kamu', 'dia', 'sebagai', 'tidak', 
    'ada', 'dengan', 'setelah', 'sebelum', 'saat', 'ketika', 'jika', 'karena', 
    'namun', 'tetapi', 'atau', 'hanya', 'saja', 'juga', 'sudah', 'telah', 'akan', 
    'bisa', 'dapat', 'oleh', 'bagi', 'sampai', 'hingga', 'kepada', 'maka', 'bin'
])

def get_id_analyzer():
    return RegexTokenizer() | LowercaseFilter() | StopFilter(stoplist=ID_STOPWORDS) | IndonesianStemFilter()
