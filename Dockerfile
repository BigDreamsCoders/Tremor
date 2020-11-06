FROM python:3.7

LABEL author="Nelson Castro" mail="00043516@uca.edu.sv"

WORKDIR /tremorsv
COPY . /tremorsv

RUN pip install -r requirements.txt

CMD [ "python","app.py" ]