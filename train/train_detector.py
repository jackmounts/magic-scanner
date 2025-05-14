import pandas as pd, tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import load_img, img_to_array

df = pd.read_csv('data/annotations.csv')

def data_generator(df, batch_size=16, is_train=True):
    ds = tf.data.Dataset.from_tensor_slices((df['filename'], 
        df[['x_min','y_min','width','height']].values))
    if is_train: ds = ds.shuffle(1000)
    def _parse(img_path, box):
        img = tf.io.read_file('data/synthetic/' + img_path)
        img = tf.image.decode_jpeg(img, channels=3)
        img = tf.image.resize(img, (224,224)) / 255.0
        return img, box
    ds = ds.map(_parse, num_parallel_calls=4).batch(batch_size).prefetch(2)
    return ds

base = MobileNetV2(input_shape=(224,224,3), include_top=False, weights='imagenet')
base.trainable = False
x = layers.GlobalAveragePooling2D()(base.output)
x = layers.Dense(128, activation='relu')(x)
out = layers.Dense(4, activation='sigmoid')(x) 
model = models.Model(inputs=base.input, outputs=out)
model.compile(optimizer='adam', loss='mse')

split = int(len(df)*0.9)
df_train, df_val = df[:split], df[split:]

train_ds = data_generator(df_train, batch_size=32, is_train=True)
val_ds   = data_generator(df_val,   batch_size=32, is_train=False)
model.fit(train_ds, validation_data=val_ds, epochs=30)

model.save('cache/saved_model_detector/')
print("✅ Training completed and model saved in cache/saved_model_detector/")