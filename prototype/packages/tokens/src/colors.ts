// packages/tokens/src/colors.ts
//
// ИСТОЧНИК ПРАВДЫ ПО ЦВЕТАМ UniPrint Design System.
// Хардкод цветов в коде — отбраковка на ревью.
// Если нужного оттенка нет — добавляйте сюда, не в компонент.

export const colors = {
  // ============ Базовые поверхности ============
  bg:        '#FAF6EF',  // основной фон страницы (кремовый «бумажный»)
  surface:   '#FFFFFF',  // карточки, модалки, формы
  surface2:  '#F4EEE2',  // вторичный фон (табы, чипы, ховер)
  surface3:  '#FBF8F2',  // ховер строк таблицы, thead

  // ============ Текст / Линии ============
  ink:       '#1A1410',  // основной текст, заголовки
  ink2:      '#3D332A',  // обычный текст в карточках
  ink3:      '#7A6F62',  // вторичный текст, метки, labels
  ink4:      '#B5A899',  // плейсхолдеры, disabled

  line:      '#E8DECC',  // основные границы карточек, разделители
  line2:     '#DCCFB6',  // hover-границы, акцентные линии

  // ============ Бренд UniPrint ============
  brand:     '#D9531E',  // primary CTA hover, акценты
  brand2:    '#B8401A',  // нажатие, тёмный текст на soft-фоне
  brandSoft: '#FBE6D9',  // фоны бейджей, soft-кнопок

  // ============ Статусы заказов ============
  // Готов / Выдан / Успех
  green:     '#5C8A3A',
  greenSoft: '#E5EDD9',
  greenInk:  '#3D5E22',  // текст на greenSoft

  // В работе / Печать / Текущая операция
  amber:     '#C9842A',
  amberSoft: '#F7E8CD',
  amberInk:  '#7A5618',

  // Брак / Ошибка / Удаление
  red:       '#B8401A',
  redSoft:   '#F6D9CE',
  redInk:    '#7A2410',

  // В очереди / Лиды
  blue:      '#3F6E8A',
  blueSoft:  '#DCE8EE',
  blueInk:   '#2E5470',

  // На дизайне / Согласование
  purple:    '#7B5896',
  purpleSoft:'#E8DFEC',
  purpleInk: '#4A3158',

  // ============ Акцент (используется аккуратно) ============
  gold:      '#C8923A',  // премиум-индикаторы, аватары
} as const

export type ColorToken = keyof typeof colors

// ============ Семантика статусов заказов (для StatusPill) ============
// Эти значения соответствуют статус-машине заказа из 03-architecture.md
export const orderStatusColors = {
  new:     { bg: 'brandSoft', text: 'brand2',    dot: 'brand' },   // только что создан
  queue:   { bg: 'blueSoft',  text: 'blueInk',   dot: 'blue' },    // в очереди
  design:  { bg: 'purpleSoft',text: 'purpleInk', dot: 'purple' },  // на дизайне / согласование
  work:    { bg: 'amberSoft', text: 'amberInk',  dot: 'amber' },   // в производстве (анимация)
  review:  { bg: 'surface2',  text: 'ink2',      dot: 'ink3' },    // на контроле качества
  done:    { bg: 'greenSoft', text: 'greenInk',  dot: 'green' },   // готов / выдан
  defect:  { bg: 'redSoft',   text: 'redInk',    dot: 'red' },     // брак (BR-03)
  archive: { bg: 'surface2',  text: 'ink3',      dot: 'ink4' },    // закрыт / архив
} as const

export type OrderStatus = keyof typeof orderStatusColors

// ============ Семантика типов заказа (BR-07) ============
export const orderTypeLabels = {
  'service-shop':   'услуга-цех',          // J1 — наружная реклама
  'service-office': 'услуга-офис',         // J2 — оперативная полиграфия
  'product-sale':   'продажа-товар',       // J3 — готовая продукция
} as const

export type OrderType = keyof typeof orderTypeLabels

// ============ Аватары — генерация по seed ============
// Используется в <Avatar tone="..." /> — tone выбирается детерминированно
// по hash(userId), чтобы у одного пользователя был стабильный цвет.
export const avatarTones = {
  brand:  'linear-gradient(135deg, #C8923A, #D9531E)',
  green:  'linear-gradient(135deg, #7AAB54, #3F6E22)',
  blue:   'linear-gradient(135deg, #5A8AA8, #2E5470)',
  amber:  'linear-gradient(135deg, #D9A84A, #A06C18)',
  purple: 'linear-gradient(135deg, #8C6FA8, #5A4070)',
  dark:   'linear-gradient(135deg, #5A4F40, #2A2018)',
} as const

export type AvatarTone = keyof typeof avatarTones
