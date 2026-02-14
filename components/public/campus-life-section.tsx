"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const campusItems = [
  { title: "Science Labs", category: "Academics", aspect: "aspect-[4/3]" },
  { title: "School Library", category: "Resources", aspect: "aspect-[4/3]" },
  { title: "Sports Complex", category: "Athletics", aspect: "aspect-[4/3]" },
  { title: "Art Studio", category: "Creative Arts", aspect: "aspect-[4/3]" },
  { title: "Auditorium", category: "Events", aspect: "aspect-[4/3]" },
  { title: "Computer Lab", category: "Technology", aspect: "aspect-[4/3]" },
]

export function CampusLifeSection() {
  const ref = useScrollAnimation()

  return (
    <section ref={ref} className="bg-secondary py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div className="animate-on-scroll mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Beyond the Classroom
          </p>
          <h2 className="heading-2 text-balance text-foreground">
            Campus Life
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {campusItems.map((item, i) => (
            <div
              key={item.title}
              className="animate-on-scroll group relative overflow-hidden rounded-lg bg-muted"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Placeholder */}
              <div className={`${item.aspect} w-full bg-border transition-transform duration-300 group-hover:scale-105`}>
                <div className="flex h-full items-center justify-center">
                  <span className="text-sm text-muted-foreground">Image Placeholder</span>
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/60">
                  {item.category}
                </p>
                <p className="font-serif text-lg font-semibold text-primary-foreground">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
