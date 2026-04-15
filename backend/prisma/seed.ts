import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const adminHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@iramcinema.tj' },
    update: {},
    create: { name: 'Admin', email: 'admin@iramcinema.tj', password: adminHash, role: 'ADMIN' },
  });

  // Test user
  const userHash = await bcrypt.hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: { name: 'Test User', email: 'user@test.com', password: userHash },
  });

  // Genres
  const genres = await Promise.all([
    'Боевик', 'Комедия', 'Драма', 'Триллер', 'Фантастика', 'Анимация', 'Ужасы', 'Мелодрама'
  ].map(name => prisma.genre.upsert({ where: { name }, update: {}, create: { name } })));

  // Hall
  const existingHall = await prisma.hall.findFirst({ where: { name: 'Зал 1' } });
  let hall = existingHall;
  if (!hall) {
    hall = await prisma.hall.create({ data: { name: 'Зал 1', rows: 8 } });
    const layout = [
      { row: 1, seats: [1,2,3,4,5,6,7,8,9,10,11,12] },
      { row: 2, seats: [1,2,3,4,5,6,7,8,9,10,11,12] },
      { row: 3, seats: [1,2,3,4,5,6,7,8,9,10,11,12] },
      { row: 4, seats: [1,2,3,4,5,6,7,8] },
      { row: 5, seats: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16] },
      { row: 6, seats: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20] },
      { row: 7, seats: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20] },
      { row: 8, seats: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24] },
    ];
    for (const rowData of layout) {
      for (const num of rowData.seats) {
        await prisma.seat.create({ data: { hallId: hall.id, row: rowData.row, number: num } });
      }
    }
    console.log('✅ Hall and seats created');
  }

  // Movies
  const movies = [
    {
      title: 'Dune: Part Two',
      titleRu: 'Дюна: Часть вторая',
      description: 'Пол Атрейдес объединяется с Чани и фрименами...',
      duration: 166, ageLimit: '12+', language: 'RU',
      poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      genres: ['Фантастика', 'Драма'],
    },
    {
      title: 'Deadpool & Wolverine',
      titleRu: 'Дэдпул и Росомаха',
      description: 'Дэдпул и Росомаха вместе противостоят угрозе...',
      duration: 127, ageLimit: '18+', language: 'RU',
      poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      genres: ['Боевик', 'Комедия'],
    },
    {
      title: 'Inside Out 2',
      titleRu: 'Головоломка 2',
      description: 'Рили вступает в переходный возраст...',
      duration: 100, ageLimit: '6+', language: 'RU',
      poster: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
      genres: ['Анимация', 'Комедия'],
    },
    {
      title: 'Alien: Romulus',
      titleRu: 'Чужой: Ромул',
      description: 'Молодые колонисты сталкиваются с Чужим...',
      duration: 119, ageLimit: '18+', language: 'RU',
      poster: 'https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg',
      genres: ['Ужасы', 'Фантастика'],
    },
  ];

  for (const m of movies) {
    const exists = await prisma.movie.findFirst({ where: { title: m.title } });
    if (!exists) {
      const { genres: g, ...data } = m;
      const movie = await prisma.movie.create({
        data: {
          ...data,
          genres: { connect: genres.filter(gr => g.includes(gr.name)).map(gr => ({ id: gr.id })) },
        },
      });

      // Create sessions for next 7 days
      const times = ['10:00', '13:00', '16:00', '19:30', '22:00'];
      for (let d = 0; d < 7; d++) {
        for (const time of times.slice(0, 3)) {
          const [h, min] = time.split(':').map(Number);
          const start = new Date();
          start.setDate(start.getDate() + d);
          start.setHours(h, min, 0, 0);
          const end = new Date(start.getTime() + data.duration * 60000);
          await prisma.session.create({
            data: { movieId: movie.id, hallId: hall.id, startTime: start, endTime: end, price: 45 },
          });
        }
      }
    }
  }

  console.log('✅ Seeding complete!');
  console.log('👤 Admin: admin@iramcinema.tj / admin123');
  console.log('👤 User:  user@test.com / user123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
