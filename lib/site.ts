/**
 * Контакты для заявок. ЗАПОЛНИТЕ ДВА ПОЛЯ — и все кнопки сайта начнут работать.
 *  telegram: username без @, например "triocrash"
 *  whatsapp: номер в международном формате, только цифры, например "992900000000"
 * Пока поля пустые, кнопки мессенджеров скрыты, а форма честно сообщает, что приём заявок не настроен.
 */
export const SITE = {
  telegram: "",
  whatsapp: "",
};

export type Channel = "telegram" | "whatsapp";

export const channels = (): Channel[] => {
  const list: Channel[] = [];
  if (SITE.telegram) list.push("telegram");
  if (SITE.whatsapp) list.push("whatsapp");
  return list;
};

export const hasChannels = () => channels().length > 0;

export const CHANNEL_LABEL: Record<Channel, string> = { telegram: "Telegram", whatsapp: "WhatsApp" };

/** Ссылка на чат с готовым текстом заявки. */
export function channelLink(ch: Channel, text: string) {
  const t = encodeURIComponent(text);
  return ch === "telegram"
    ? `https://t.me/${SITE.telegram.replace(/^@/, "")}?text=${t}`
    : `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${t}`;
}

export function leadMessage(o: { name?: string; contact?: string; plan?: string; note?: string }) {
  const lines = ["Здравствуйте! Хочу обсудить проект с TRIOCRASH."];
  if (o.plan) lines.push(`Тариф: ${o.plan}`);
  if (o.name) lines.push(`Меня зовут: ${o.name}`);
  if (o.contact) lines.push(`Мой контакт: ${o.contact}`);
  if (o.note) lines.push(`О проекте: ${o.note}`);
  return lines.join("\n");
}
