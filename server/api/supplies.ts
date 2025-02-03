export default defineEventHandler(async (event) => {
  // Ваша серверная логика для получения данных о приёмках
  const supplies = [
    { id: 1, name: 'Приёмка 1', date: '2023-05-10', status: 'Активна' },
    { id: 2, name: 'Приёмка 2', date: '2023-05-11', status: 'Завершена' },
  ]

  return supplies
})