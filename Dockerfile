FROM python:3.9-slim-bookworm

WORKDIR /workspace

COPY requirements.txt .

RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

COPY . /workspace

ENTRYPOINT ["tensorflowjs_converter", \
            "--input_format=tf_saved_model", \
            "--quantize_uint8", \
            "  --weight_shard_count 1", \
            "cache/saved_model_detector", \
            "web_model/tfjs_detector"]