import joblib
import os


MODEL_PATH = "category_model.pkl"
if not os.path.exists(MODEL_PATH):
    raise RuntimeError("AI kategori modeli bulunamadı. Lütfen train_category_model.py çalıştırın.")

vectorizer, model = joblib.load(MODEL_PATH)

def predict_category(text: str) -> str:
    X = vectorizer.transform([text])
    prediction = model.predict(X)[0]
    return prediction
