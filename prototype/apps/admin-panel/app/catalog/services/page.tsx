'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
  BRCallout,
  StatPill,
} from '@uniprint/ui';

const MOCK_SERVICES = [
  { id: 'svc_001', name: 'Баннерная печать (интерьер)', category: 'Цех · наружка', unit: 'м²', price: 850, normTime: 12 },
  { id: 'svc_002', name: 'Баннерная печать (экстерьер)', category: 'Цех · наружка', unit: 'м²', price: 950, normTime: 14 },
  { id: 'svc_003', name: 'Монтаж баннера', category: 'Цех · наружка', unit: 'м²', price: 450, normTime: 30 },
  { id: 'svc_004', name: 'Печать визиток (полноцвет)', category: 'Офис-полиграфия', unit: '100 шт', price: 650, normTime: 20 },
  { id: 'svc_005', name: 'Печать листовок А5', category: 'Офис-полиграфия', unit: '100 шт', price: 480, normTime: 15 },
  { id: 'svc_006', name: 'Ламинация А4', category: 'Офис-полиграфия', unit: 'шт', price: 35, normTime: 3 },
  { id: 'svc_007', name: 'Вывеска световая', category: 'Цех · наружка', unit: 'шт', price: 12000, normTime: 240 },
  { id: 'svc_008', name: 'Широкоформатная печать', category: 'Цех · наружка', unit: 'м²', price: 1100, normTime: 10 },
  { id: 'svc_009', name: 'Шелкография (1 цвет)', category: 'Офис-полиграфия', unit: '100 шт', price: 1800, normTime: 60 },
  { id: 'svc_010', name: 'Брошюровка (скоба)', category: 'Офис-полиграфия', unit: 'шт', price: 25, normTime: 5 },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Каталог"
        accentText="услуг"
        description="Справочник формируется с нуля по R3-track (типограф-консультант + владелец). Все изменения только через администратора."
      />

      <BRCallout
        className="mt-6"
        rules={[
          { code: 'BR-04', text: 'Производство не создаёт услуги вручную — только выбирает из справочника.' },
          { code: 'BR-14', text: 'Справочник меняет только администратор. История изменений сохраняется (audit-log).' },
        ]}
      />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Услуги (R3-track)</CardTitle>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--color-ink-3)',
            }}
          >
            47 позиций
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <table className="w-full min-w-[580px] text-sm">
              <thead>
                <tr style={{ background: 'var(--color-surface-3)' }}>
                  <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>ID</th>
                  <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Название</th>
                  <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Категория</th>
                  <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Ед.</th>
                  <th className="p-3 text-right font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Цена</th>
                  <th className="p-3 text-right font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Норма, мин</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SERVICES.map((svc) => (
                  <tr key={svc.id} className="border-t border-[var(--color-border)]">
                    <td className="p-3">
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--color-ink-3)',
                        }}
                      >
                        {svc.id}
                      </span>
                    </td>
                    <td className="p-3" style={{ fontWeight: 500 }}>{svc.name}</td>
                    <td className="p-3">
                      <StatPill
                        tone={svc.category.startsWith('Цех') ? 'work' : 'queue'}
                        withDot={false}
                      >
                        {svc.category}
                      </StatPill>
                    </td>
                    <td className="p-3" style={{ color: 'var(--color-ink-3)', fontSize: '12px' }}>{svc.unit}</td>
                    <td className="p-3 text-right">
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 500,
                          fontSize: '14px',
                        }}
                      >
                        {svc.price.toLocaleString('ru-RU')}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-ink-3)' }}> ₽</span>
                    </td>
                    <td className="p-3 text-right">
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          color: 'var(--color-ink-2)',
                        }}
                      >
                        {svc.normTime}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="p-3 text-xs" style={{ color: 'var(--color-ink-3)' }}>
            показано {MOCK_SERVICES.length} из 47 · остальные добавляются в рамках R3-track
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
