-- Таблица услуг
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  price_note TEXT,
  duration_minutes INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Таблица записей
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_telegram TEXT,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Индексы
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Публичное чтение услуг
CREATE POLICY "Services are viewable by everyone"
  ON services FOR SELECT
  USING (true);

-- Публичное создание записей
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Публичное чтение записей (для проверки слотов)
CREATE POLICY "Bookings are viewable by everyone"
  ON bookings FOR SELECT
  USING (true);

-- Seed data: 17 услуг
INSERT INTO services (name, price, price_note, duration_minutes, sort_order) VALUES
  ('Женская стрижка', 1500, NULL, 60, 1),
  ('Мужская стрижка', 800, NULL, 30, 2),
  ('Детская стрижка', 600, NULL, 30, 3),
  ('Стрижка чёлки', 300, NULL, 15, 4),
  ('Окрашивание в один тон', 2500, 'от', 120, 5),
  ('Мелирование', 3500, 'от', 150, 6),
  ('Балаяж / Шатуш', 5000, 'от', 180, 7),
  ('Тонирование', 1500, 'от', 60, 8),
  ('Осветление', 3000, 'от', 120, 9),
  ('Укладка', 1000, NULL, 40, 10),
  ('Вечерняя причёска', 2500, 'от', 90, 11),
  ('Свадебная причёска', 4000, 'от', 120, 12),
  ('Ламинирование', 2000, 'от', 60, 13),
  ('Кератиновое выпрямление', 4000, 'от', 150, 14),
  ('Ботокс для волос', 3500, 'от', 120, 15),
  ('Уход Olaplex', 1500, NULL, 30, 16),
  ('Консультация стилиста', 0, NULL, 30, 17);
