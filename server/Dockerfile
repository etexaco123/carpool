FROM python:3.7-slim

COPY ./src/ ./home/app/

WORKDIR /home/app/

RUN pip install flask

CMD python app.py