import { listSiteUpdates, type SiteUpdate } from '@/lib/site-updates'
import type { HomepageSection } from '@/lib/homepage-sections'

function formatDate(value: string | null) {
  if (!value) return 'Kabar Setitik'

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

function getUpdateTime(update: SiteUpdate) {
  const dateValue = update.eventDate
    ? new Date(`${update.eventDate}T00:00:00`).getTime()
    : new Date(update.createdAt).getTime()

  return Number.isFinite(dateValue) ? dateValue : 0
}

function sortUpdatesByNewest(updates: SiteUpdate[]) {
  return [...updates].sort((a, b) => {
    const dateDifference = getUpdateTime(b) - getUpdateTime(a)

    if (dateDifference !== 0) return dateDifference

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export function UpdateCard({
  update,
  priority = false,
  featured = false,
  imageOverride,
}: {
  update: SiteUpdate
  priority?: boolean
  featured?: boolean
  imageOverride?: string | null
}) {
  return (
    <article
      className={`group relative isolate h-full min-h-[340px] overflow-hidden rounded-[0.9rem] border border-forest/15 bg-forest shadow-[0_20px_55px_rgba(31,45,34,0.13)] ${
        featured ? 'md:min-h-[560px]' : 'md:min-h-[270px]'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden bg-forest">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageOverride ?? update.imageUrl}
          alt={update.title}
          loading={priority ? 'eager' : 'lazy'}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
          style={{
            objectPosition: `center ${update.imagePositionY}%`,
            transform: `scale(${update.imageZoom})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/35 to-forest/5" />
      </div>

      <div className="relative flex h-full min-h-[inherit] flex-col justify-between p-5 sm:p-7">
        <p className="w-fit rounded-full border border-silk/30 bg-forest/75 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-silk backdrop-blur-sm">
          {formatDate(update.eventDate)}
        </p>

        <div className="max-w-2xl">
          <p className="mb-3 flex items-center gap-3 text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-[#d6bd91]">
            <span className="h-px w-8 bg-[#d6bd91]" />
            Cerita terbaru
          </p>
          <h3
            className={`font-serif leading-[1.05] text-silk ${
              featured ? 'text-3xl sm:text-5xl' : 'text-3xl'
            }`}
          >
            {update.title}
          </h3>
          <p className={`mt-3 text-sm leading-7 text-silk/75 ${featured ? 'line-clamp-4' : 'line-clamp-2'}`}>
            {update.description}
          </p>
        </div>
      </div>
    </article>
  )
}

export default async function LatestUpdatesSection({ section }: { section?: HomepageSection }) {
  let updates: SiteUpdate[] = []

  try {
    updates = sortUpdatesByNewest(
      await listSiteUpdates({ target: 'latest', limit: 3 })
    )
  } catch {
    updates = []
  }

  if (updates.length === 0) {
    return null
  }

  return (
    <section className="bg-silk px-4 py-10 text-ink sm:px-6 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 grid gap-4 border-b border-sand pb-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-4 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-brown">
              <span className="h-px w-9 bg-brown" />
              Kabar Setitik
            </p>
            <h2 className="max-w-3xl font-serif text-4xl leading-[1.02] sm:text-5xl md:text-6xl">
              {section?.title && section.title !== 'Dokumentasi terbaru' ? section.title : 'Yang baru dari Setitik.'}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-stone md:text-right">
            {section?.description && section.description !== 'Bagian otomatis dari foto dan kegiatan yang diterbitkan owner.' ? section.description : 'Catatan terbaru tentang perjalanan, karya, dan perjumpaan Setitik.'}
          </p>
        </div>

        <div className="rounded-[1.25rem] border border-sand bg-cream p-3 shadow-[0_24px_70px_rgba(63,47,27,0.07)] sm:p-4">
          <div className="grid gap-4 md:grid-cols-12">
          {updates.map((update, index) => (
            <div
              key={update.id}
              className={index === 0 ? 'md:col-span-7 md:row-span-2' : 'md:col-span-5'}
            >
              <UpdateCard
                update={update}
                priority={index === 0}
                featured={index === 0}
                imageOverride={index === 0 ? section?.imageUrl : null}
              />
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
