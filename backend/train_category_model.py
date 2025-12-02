from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

# Eğitim verisi (ileride büyütülebilir)
texts = [
    "sokakta çöp yığılmış", "çöp bidonu dolmuş", "çöpler alınmıyor",
    "yolda çukur var", "asfalt bozuk", "yolda çalışma var",
    "sokak lambası yanmıyor", "ışıklar patlamış", "trafik ışığı arızalı"
]
labels = [
    "Çöp", "Çöp", "Çöp",
    "Yol", "Yol", "Yol",
    "Işıklandırma", "Işıklandırma", "Işıklandırma"
]

# Vektörleştirici + model
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

model = LogisticRegression()
model.fit(X, labels)

# Kaydet
joblib.dump((vectorizer, model), "category_model.pkl")
print("✅ Model kaydedildi: category_model.pkl")
