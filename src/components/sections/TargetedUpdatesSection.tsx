import { listSiteUpdates, type SiteUpdate, type SiteUpdateTarget } from '@/lib/site-updates'

type Props = {
  target: SiteUpdateTarget
  eyebrow: string
  title: string
  description: string
  tone?: 'cream' | 'silk' | 'forest'
  limit?: number
}

function formatDate(value: string | null) {
  if (!value) return 'Setitik'

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

function SmallUpdateCard({ update }: { update: SiteUpdate }) {
  return (
    <article className="grid overflow-hidden border border-sand bg-silk shadow-[0_18px_55px_rgba(63,47,27,0.08)] sm:grid-cols-[180px_1fr]">
      <figure className="relative min-h-52 overflow-hidden bg-[#e7dac8] sm:min-h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={update.imageUrl}
          alt={update.title}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: `center ${update.imagePositionY}%`,
            transform: `scale(${update.imageZoom})`,
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/45 via-transparent to-transparent" />
      </figure>
      <div className="p-5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-brown">
          {formatDate(update.eventDate)}
        </p>
        <h3 className="mt-3 font-serif text-2xl leading-tight text-ink">{update.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone">{update.description}</p>
      </div>
    </article>
  )
}

export default async function TargetedUpdatesSection({
  target,
  eyebrow,
  title,
  description,
  tone = 'cream',
  limit = 5,
}: Props) {
  let updates: SiteUpdate[] = []

  try {
    updates = await listSiteUpdates({ target, limit })
  } catch {
    updates = []
  }

  if (updates.length === 0) {
    return null
  }

  const [spotlight, ...archive] = updates
  const dark = tone === 'forest'

  return (
    <section
      className={`px-4 py-12 sm:px-6 md:py-16 ${
        dark ? 'bg-forest text-silk' : tone === 'silk' ? 'bg-silk text-ink' : 'bg-cream text-ink'
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={`mb-8 grid gap-5 border-b pb-6 lg:grid-cols-[0.88fr_1fr] lg:items-end ${
            dark ? 'border-silk/15' : 'border-sand'
          }`}
        >
          <div>
            <p
              className={`mb-4 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] ${
                dark ? 'text-brown' : 'text-brown'
              }`}
            >
              <span className="h-px w-9 bg-brown" />
              {eyebrow}
            </p>
            <h2 className={`max-w-3xl font-serif text-4xl leading-[1.02] sm:text-5xl md:text-6xl ${dark ? 'text-silk' : 'text-ink'}`}>
              {title}
            </h2>
          </div>
          <p className={`max-w-2xl text-sm leading-8 md:text-base lg:ml-auto ${dark ? 'text-silk/65' : 'text-stone'}`}>
            {description}
          </p>
        </div>

        <article className={`overflow-hidden border shadow-[0_26px_80px_rgba(63,47,27,0.12)] lg:grid lg:grid-cols-[1.08fr_0.92fr] ${
          dark ? 'border-silk/12 bg-silk text-forest' : 'border-sand bg-silk'
        }`}>
          <figure className="relative min-h-[320px] overflow-hidden bg-[#e7dac8] md:min-h-[460px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={spotlight.imageUrl}
              alt={spotlight.title}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: `center ${spotlight.imagePositionY}%`,
                transform: `scale(${spotlight.imageZoom})`,
              }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-transparent to-transparent" />
            <p className="absolute left-5 top-5 border border-white/35 bg-white/90 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-forest">
              {formatDate(spotlight.eventDate)}
            </p>
          </figure>

          <div className="flex min-h-[360px] flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div>
              <p className="mb-5 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brown">
                <span className="h-px w-9 bg-brown" />
                Terbaru
              </p>
              <h3 className="max-w-xl font-serif text-4xl leading-[1.02] text-ink md:text-5xl">
                {spotlight.title}
              </h3>
            </div>
            <p className="mt-8 border-t border-sand pt-5 text-sm leading-8 text-stone md:text-base">
              {spotlight.description}
            </p>
          </div>
        </article>

        {archive.length > 0 && (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {archive.map((update) => (
              <SmallUpdateCard key={update.id} update={update} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
