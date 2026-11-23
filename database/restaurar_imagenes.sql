UPDATE productos p SET imagen = v.imagen
FROM (VALUES
  ('P001', '/imagenes/productos/interstellar.jpg'),
  ('P002', '/imagenes/productos/the-dark-knight.jpg'),
  ('P003', '/imagenes/productos/inception.jpg'),
  ('P004', '/imagenes/productos/breaking-bad.jpg'),
  ('P005', '/imagenes/productos/chernobyl.jpg'),
  ('P006', '/imagenes/productos/game-of-thrones-t1.jpg'),
  ('P007', '/imagenes/productos/blade-runner-final-cut.jpg'),
  ('P008', '/imagenes/productos/apocalypse-now-final-cut.jpg'),
  ('P009', '/imagenes/productos/alien-directors-cut.jpg'),
  ('P010', '/imagenes/productos/el-senor-de-los-anillos.jpg'),
  ('P011', '/imagenes/productos/el-padrino.jpg'),
  ('P012', '/imagenes/productos/volver-al-futuro.jpg')
) AS v(codigo, imagen)
WHERE p.codigo = v.codigo AND (p.imagen IS NULL OR p.imagen = '');
