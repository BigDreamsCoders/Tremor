from os import getenv
from sqlalchemy import create_engine, Column, String, Integer, Numeric
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from geoalchemy2 import Geometry

USER = getenv("DB_USER", "")
PASSWORD = getenv("DB_PASSWORD", "")
HOST = getenv("DB_HOST", "")
PORT = getenv("DB_PORT", 0)
NAME = getenv("DB_NAME", "")

_DB_STRING = f"postgres://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}"

db = create_engine(_DB_STRING)

Base = declarative_base()

Session = sessionmaker(db)
session = Session()


class Sismos(Base):
  __tablename__ = 'sismos'
  id = Column('id', Integer, primary_key=True)
  date = Column('fecha', String)
  localtime = Column('hora_local', String)
  lat = Column('latitud', Numeric)
  long = Column('longitud', Numeric)
  localization = Column('localizacion', String)
  depth = Column('profundidad', Numeric)
  magnitude = Column('magnitud', Numeric)
  intensity = Column('intensidad', String)
  geom = Column('geom', Geometry(geometry_type="POINT", srid=100000))

def getSismosPointsWithinBoundaries():
  sismos = session.execute("select sismos.latitud, sismos.longitud from sismos join \"departamentos\" as dept on st_intersects(dept.geom, sismos.geom)")
  data = sismos.fetchall()
  sismos.close()
  array=[]
  for entry in data:
    array.append({
            "lat": float(entry[0]),
            "lgn": float(entry[1]),
        })
  return array

def getAllSismosPoints(timestamp):
  sismos = session.execute("select sismos.latitud, sismos.longitud from sismos;")
  data = sismos.fetchall()
  sismos.close()
  array=[]
  for entry in data:
    array.append([timestamp, float(entry[0]), float(entry[1])])
  return array