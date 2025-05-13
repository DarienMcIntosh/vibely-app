from app.database import SessionLocal
from app.ml.data_processing.feature_extractor import build_training_dataset

db = SessionLocal()
df = build_training_dataset(db)
print(df.head())
df.to_csv("training_data.csv", index=False)