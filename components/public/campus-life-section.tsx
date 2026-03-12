"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Image from "next/image"

const campusItems = [
  { title: "Science Labs", image: "/images/campus-life/campus-1.jpg", aspect: "aspect-[4/3]" },
  { title: "School Library", image: "/images/campus-life/campus-2.jpg", aspect: "aspect-[4/3]" },
  { title: "Sports Complex", image: "/images/campus-life/campus-3.jpg", aspect: "aspect-[4/3]" },
  { title: "Computer Lab", image: "/images/campus-life/campus-4.jpg", aspect: "aspect-[4/3]" },
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:gap-6">
          {campusItems.map((item, i) => (
            <div
              key={item.title}
              className="animate-on-scroll group relative overflow-hidden rounded-lg bg-muted"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Image Container with Original Aspect Ratio */}
              <div className={`${item.aspect} relative w-full overflow-hidden`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* No Overlay/Title as requested */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
