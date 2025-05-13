import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from app.database import SessionLocal
from app.ml.data_processing.feature_extractor import build_training_dataset
import os

MODEL_PATH = "app/ml/models/saved_models/fyp_model.h5"

def create_model():
    model = keras.Sequential([
        layers.Input(shape=(3,)),  # category_match, location_match, trust_score
        layers.Dense(64, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(32, activation='relu'),
        layers.Dense(1, activation='sigmoid')  # binary output
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

def train_and_save_model():
    db = SessionLocal()
    df = build_training_dataset(db)

    # Features and label
    X = df[["category_match", "location_match", "trust_score"]].values
    y = df["label"].values

    model = create_model()
    model.fit(X, y, epochs=10, batch_size=32, validation_split=0.2)

    # Save the trained model
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    model.save(MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")
