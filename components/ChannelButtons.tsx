import { CHANNEL_LABEL, channelLink, channels, leadMessage, type Channel } from "@/lib/site";

const ICON: Record<Channel, React.ReactNode> = {
  telegram: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
  whatsapp: (
    <>
      <path d="M3 21l1.6-4.9A8.5 8.5 0 1 1 8 19.4L3 21Z" />
      <path d="M9 9.5c.3 2.2 2.3 4.2 4.5 4.5l1.2-1.2-1.8-1-.8.6a3 3 0 0 1-1.6-1.6l.6-.8-1-1.8L9 9.5Z" />
    </>
  ),
};

/** Кнопки перехода в мессенджеры. Показываются только для каналов, заполненных в lib/site.ts. */
export function ChannelButtons({
  message,
  className = "btn btn-secondary",
  primaryFirst = true,
}: {
  message?: string;
  className?: string;
  primaryFirst?: boolean;
}) {
  const text = message ?? leadMessage({});
  return (
    <>
      {channels().map((ch, i) => (
        <a
          key={ch}
          href={channelLink(ch, text)}
          target="_blank"
          rel="noopener noreferrer"
          className={primaryFirst && i === 0 ? "btn btn-primary" : className}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            {ICON[ch]}
          </svg>
          {CHANNEL_LABEL[ch]}
        </a>
      ))}
    </>
  );
}
