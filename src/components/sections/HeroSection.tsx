'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import type { HomepageSection } from '@/lib/homepage-sections'

const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
}

const ease = [0.22, 1, 0.36, 1] as const

export default function HeroSection({ section }: { section?: HomepageSection }) {
  return (
    <section className="relative min-h-[680px] overflow-hidden bg-forest text-silk">
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background:
            'radial-gradient(circle at 82% 24%, rgba(139,107,61,0.3), transparent 30%), radial-gradient(circle at 8% 90%, rgba(245,240,232,0.08), transparent 28%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
        aria-hidden
      />
      <p
        className="pointer-events-none absolute -bottom-5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap font-serif text-[12vw] leading-none tracking-[-0.06em] text-silk/[0.025] xl:block"
        aria-hidden
      >
        CULTUREWARE
      </p>

      <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl flex-col px-6">
        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-7 lg:py-8">
          <div className="relative z-20 pt-3 lg:pt-0">
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.32, ease }}
              className="mb-7 flex items-center gap-3"
            >
              <span className="h-px w-10 bg-brown" />
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-silk/60">
                Kota Lama Semarang · Sejak 2019
              </p>
            </motion.div>

            <motion.h1
              {...fadeInUp}
              transition={{ duration: 0.36, ease, delay: 0.04 }}
              className="max-w-[700px] font-serif text-[clamp(3.25rem,5.7vw,5.9rem)] leading-[0.94] tracking-[-0.04em] text-silk"
            >
              {section?.title && section.title !== 'Pembuka website' ? (
                section.title
              ) : (
                <>
                  Setitik demi
                  <span className="block">setitik,</span>
                  <span className="mt-3 block italic leading-[0.9] text-brown">
                    menjadi semakin
                  </span>
                  <span className="block italic leading-[0.9] text-brown">berarti.</span>
                </>
              )}
            </motion.h1>

            <motion.p
              {...fadeInUp}
              transition={{ duration: 0.34, ease, delay: 0.08 }}
              className="mt-8 max-w-lg border-l border-silk/20 pl-5 font-sans text-sm leading-[1.8] text-silk/65 md:text-[15px]"
            >
              {section?.description &&
              section.description !==
                'Section pertama yang memperkenalkan Setitik di halaman utama.'
                ? section.description
                : 'Batik kontemporer yang lahir dari observasi arsitektur cagar budaya. Setiap ornamen dihidupkan kembali menjadi cerita di atas kain.'}
            </motion.p>

            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.32, ease, delay: 0.1 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/catalog"
                className="group inline-flex items-center gap-3 rounded-full bg-silk px-6 py-3.5 font-sans text-[10px] uppercase tracking-[0.17em] text-forest transition-colors duration-200 hover:bg-brown hover:text-silk"
              >
                Jelajahi belanja
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <a
                href="#proses"
                className="group inline-flex items-center gap-3 px-2 py-3 font-sans text-[10px] uppercase tracking-[0.17em] text-silk/60 transition-colors hover:text-silk"
              >
                Lihat proses
                <span className="h-px w-8 bg-silk/30 transition-all duration-300 group-hover:w-12 group-hover:bg-brown" />
              </a>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.32, ease, delay: 0.12 }}
              className="mt-10 flex items-center gap-7 border-t border-silk/10 pt-6 sm:gap-10"
            >
              <div>
                <p className="font-serif text-2xl text-silk">11+</p>
                <p className="mt-1 font-sans text-[8px] uppercase tracking-[0.18em] text-silk/40">
                  Bangunan
                </p>
              </div>
              <span className="h-9 w-px bg-silk/15" />
              <div>
                <p className="font-serif text-2xl text-silk">2019</p>
                <p className="mt-1 font-sans text-[8px] uppercase tracking-[0.18em] text-silk/40">
                  Tahun berdiri
                </p>
              </div>
              <span className="h-9 w-px bg-silk/15" />
              <div>
                <p className="font-serif text-2xl text-silk">Semarang</p>
                <p className="mt-1 font-sans text-[8px] uppercase tracking-[0.18em] text-silk/40">
                  Akar cerita
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, ease, delay: 0.08 }}
            className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[560px]"
          >
            <div className="absolute bottom-[6%] right-0 top-[5%] w-[78%] rounded-[2.75rem] border border-silk/10 bg-silk/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
            <div className="absolute left-[12%] top-[48%] h-px w-[36%] bg-brown/45" />
            <div className="absolute bottom-[22%] left-[18%] h-[28%] w-px bg-brown/35" />

            <motion.figure
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, ease, delay: 0.1 }}
              className="absolute right-[4%] top-[7%] z-20 h-[76%] w-[56%] overflow-hidden rounded-[190px_190px_30px_30px] border border-silk/25 bg-sand shadow-[0_32px_75px_rgba(0,0,0,0.34)] sm:right-[8%] lg:right-[5%]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={section?.imageUrl ?? '/images/products/batik-tulis-blenduk.webp'}
                alt="Batik Tulis Blenduk Setitik dikenakan di kawasan Gereja Blenduk"
                className="h-full w-full object-cover"
                style={{ objectPosition: 'center 50%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />
            </motion.figure>

            <motion.figure
              initial={{ opacity: 0, x: -10, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.34, ease, delay: 0.14 }}
              className="absolute bottom-[9%] left-[2%] z-30 w-[43%] overflow-hidden rounded-[1.35rem] border-[5px] border-forest bg-silk shadow-[0_24px_55px_rgba(0,0,0,0.36)] sm:left-[4%]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/locations/semarang-gereja-blenduk.jpg"
                  alt="Gereja Blenduk sebagai sumber inspirasi motif Setitik"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-sans text-[7px] uppercase tracking-[0.18em] text-stone">
                    Sumber motif
                  </p>
                  <p className="mt-1 font-serif text-sm text-ink sm:text-base">
                    Gereja Blenduk
                  </p>
                </div>
              </figcaption>
            </motion.figure>

            <motion.figure
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease, delay: 0.16 }}
              className="absolute left-[7%] top-[10%] z-30 w-[31%] overflow-hidden rounded-[1.4rem] border-[5px] border-forest bg-silk shadow-xl sm:left-[9%] sm:w-[27%]"
            >
              <div className="aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/products/taplak-blenduk.png"
                  alt="Detail motif Batik Tulis Blenduk Setitik"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: 'center' }}
                />
              </div>
              <figcaption className="hidden items-center justify-between gap-3 px-4 py-3 sm:flex">
                <p className="font-sans text-[7px] uppercase tracking-[0.18em] text-stone">
                  Detail motif
                </p>
                <span className="h-1.5 w-1.5 rounded-full bg-brown" />
              </figcaption>
            </motion.figure>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease, delay: 0.18 }}
              className="absolute bottom-[10%] right-[2%] z-30 max-w-[260px] rounded-full border border-silk/20 bg-forest/82 px-5 py-3 text-right shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-md sm:right-[5%]"
            >
              <p className="font-sans text-[7px] uppercase tracking-[0.22em] text-silk/50">
                Batik Tulis
              </p>
              <p className="mt-1 font-serif text-base leading-none text-silk sm:text-lg">
                Batik Tulis Blenduk
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, ease, delay: 0.2 }}
              className="absolute right-[2%] top-[10%] z-30 flex h-16 w-16 items-center justify-center rounded-full border border-silk/30 bg-forest/75 backdrop-blur-md sm:right-[5%] sm:h-20 sm:w-20"
            >
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-1 h-[calc(100%-8px)] w-[calc(100%-8px)]"
                aria-hidden
              >
                <defs>
                  <path
                    id="hero-circle-path"
                    d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                  />
                </defs>
                <text className="fill-silk/55 font-sans text-[8px] uppercase tracking-[0.22em]">
                  <textPath href="#hero-circle-path">Setitik · Cultureware · </textPath>
                </text>
              </svg>
              <span className="h-2 w-2 rounded-full bg-brown" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28, ease, delay: 0.2 }}
          className="hidden"
        >
          <p className="font-sans text-[8px] uppercase tracking-[0.2em] text-silk/30">
            Batik · Arsitektur · Warisan
          </p>
          <div className="flex items-center gap-3">
            <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-silk/35">
              Gulir
            </span>
            <div>
              <ChevronDown size={13} className="text-brown" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
