import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ===== DATA ===== */
const products = [
  { name: 'Classic Smooth', desc: 'Silky smooth texture, pure peanut perfection', price: '\u20B9349', image: '/images/product-classic.jpg' },
  { name: 'Extra Crunchy', desc: 'Loaded with real peanut pieces', price: '\u20B9349', image: '/images/product-crunchy.jpg' },
  { name: 'Honey Blend', desc: 'Golden honey swirled in every jar', price: '\u20B9379', image: '/images/product-honey.jpg' },
  { name: 'Chocolate Swirl', desc: 'Rich cocoa meets creamy peanut butter', price: '\u20B9379', image: '/images/product-chocolate.jpg' },
]

const recipes = [
  { name: 'Peanut Butter Smoothie Bowl', time: '10 min', image: '/images/recipe-smoothie.jpg' },
  { name: 'Banana Peanut Butter Toast', time: '5 min', image: '/images/recipe-toast.jpg' },
  { name: 'Protein Energy Balls', time: '15 min', image: '/images/recipe-balls.jpg' },
  { name: 'Peanut Butter Oatmeal', time: '8 min', image: '/images/recipe-oatmeal.jpg' },
]

const testimonials = [
  { quote: "The smoothest peanut butter I've ever tasted. You can really tell it's made with quality ingredients. My morning toast has never been better!", name: 'Priya Sharma', location: 'Mumbai', avatar: '/images/testimonial-1.jpg', rating: 5 },
  { quote: "As a fitness enthusiast, I love that Uday's is pure protein without any additives. The crunchy variant is my absolute favorite post-workout snack.", name: 'Arjun Patel', location: 'Bangalore', avatar: '/images/testimonial-2.jpg', rating: 5 },
  { quote: "My kids absolutely love the chocolate swirl! And I love that it's made with natural ingredients. Finally a peanut butter I feel good about serving my family.", name: 'Anita Desai', location: 'Delhi', avatar: '/images/testimonial-3.jpg', rating: 5 },
]

const nutritionStats = [
  { value: '25g', label: 'Protein', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { value: '0g', label: 'Trans Fat', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
  { value: '12g', label: 'Healthy Fats', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  { value: '100%', label: 'Natural', icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' },
]

const curtainImages = [
  '/images/hero-jar.jpg',
  '/images/product-classic.jpg',
  '/images/product-crunchy.jpg',
  '/images/product-honey.jpg',
  '/images/product-chocolate.jpg',
  '/images/story-peanuts.jpg',
  '/images/recipe-smoothie.jpg',
  '/images/recipe-toast.jpg',
]

/* ===== APP COMPONENT ===== */
export default function App() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const stripsRef = useRef<(HTMLDivElement | null)[]>([])
  const columnsRef = useRef<(HTMLDivElement | null)[]>([])
  const columnInnersRef = useRef<(HTMLDivElement | null)[]>([])
  const navRef = useRef<HTMLElement>(null)
  const [activeNav, setActiveNav] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  /* ===== CUSTOM CURSOR ===== */
  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX - 10,
        y: e.clientY - 10,
        duration: 0.08,
        ease: 'power2.out',
      })
    }

    const onMouseEnterCard = () => {
      gsap.to(cursor, { width: 40, height: 40, backgroundColor: 'rgba(232,160,0,0.15)', borderWidth: 2, borderColor: '#FFF8F0', duration: 0.3 })
    }
    const onMouseLeaveCard = () => {
      gsap.to(cursor, { width: 20, height: 20, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#E8A000', duration: 0.3 })
    }

    window.addEventListener('mousemove', onMouseMove)

    const cards = document.querySelectorAll('.product-card, .recipe-card')
    cards.forEach(card => {
      card.addEventListener('mouseenter', onMouseEnterCard)
      card.addEventListener('mouseleave', onMouseLeaveCard)
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cards.forEach(card => {
        card.removeEventListener('mouseenter', onMouseEnterCard)
        card.removeEventListener('mouseleave', onMouseLeaveCard)
      })
    }
  }, [isLoaded])

  /* ===== LENIS SMOOTH SCROLL ===== */
  useEffect(() => {
    let lenis: any

    const initLenis = async () => {
      const Lenis = (await import('@studio-freight/lenis')).default
      lenis = new Lenis({ lerp: 0.15, smoothWheel: true })

      lenis.on('scroll', ScrollTrigger.update)

      gsap.ticker.add((time: number) => {
        lenis.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)
    }

    initLenis()

    return () => {
      if (lenis) lenis.destroy()
    }
  }, [])

  /* ===== ENTRANCE ANIMATIONS ===== */
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    // Nav entrance
    gsap.fromTo(navRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 })

    // Hero content entrance
    gsap.fromTo('.hero-card-wrap', { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.5 })

    // Text reveal for hero headline
    const heroChars1 = document.querySelectorAll('.hero-line1 .char')
    const heroChars2 = document.querySelectorAll('.hero-line2 .char')

    gsap.fromTo(heroChars1, { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.03, delay: 1 })
    gsap.fromTo(heroChars2, { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.03, delay: 1.2 })

    gsap.fromTo('.hero-sub', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 2.2 })
    gsap.fromTo('.hero-cta-btn', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.1, delay: 2.4 })
    gsap.fromTo('.scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 2.8 })
  }, [isLoaded])

  /* ===== CURTAIN INFINITY SCROLL ===== */
  useEffect(() => {
    if (!isLoaded) return

    const columns = columnsRef.current.filter(Boolean)
    const inners = columnInnersRef.current.filter(Boolean)

    const timelines: gsap.core.Animation[] = []

    columns.forEach((col, i) => {
      if (!col) return
      const inner = inners[i]
      if (!inner) return

      const speed = i % 2 === 0 ? 1.5 : 1.0

      const tl1 = gsap.to(col, {
        y: '-=75vw',
        duration: 15,
        ease: 'none',
        repeat: -1,
      })
      tl1.timeScale(speed)

      const tl2 = gsap.to(inner, {
        y: '+=75vw',
        duration: 15,
        ease: 'none',
        repeat: -1,
      })
      tl2.timeScale(speed)

      timelines.push(tl1, tl2)
    })

    // Scroll scrubbers
    const scrubTl1 = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: '+=200vh',
        scrub: true,
        pin: true,
      },
    })

    columns.forEach(col => {
      if (!col) return
      scrubTl1.to(col, { y: '+=7.25vw', opacity: 0.2, ease: 'power1.in' }, 0)
    })

    const scrubTl2 = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: '+=200vh',
        scrub: true,
      },
    })

    inners.forEach(inner => {
      if (!inner) return
      scrubTl2.to(inner, { y: '-=7.5vw', scale: 0.8, ease: 'none' }, 0)
    })

    return () => {
      timelines.forEach(tl => tl.kill())
      scrubTl1.kill()
      scrubTl2.kill()
    }
  }, [isLoaded])

  /* ===== SCROLL REVEAL SECTIONS ===== */
  useEffect(() => {
    if (!isLoaded) return

    const revealElements = document.querySelectorAll('.reveal-up')
    revealElements.forEach(el => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    // Stagger reveals
    const staggerContainers = document.querySelectorAll('.stagger-container')
    staggerContainers.forEach(container => {
      const children = container.querySelectorAll('.stagger-item')
      gsap.fromTo(children,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    // Image slide-in
    gsap.fromTo('.story-image',
      { x: 60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.story-image', start: 'top 80%', toggleActions: 'play none none none' },
      }
    )

    // Nutrition icons
    gsap.fromTo('.nutrition-icon',
      { scale: 0.8, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.15,
        scrollTrigger: { trigger: '.nutrition-icons-row', start: 'top 80%', toggleActions: 'play none none none' },
      }
    )

    // Product cards slide
    gsap.fromTo('.product-card',
      { x: 80, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.products-container', start: 'top 80%', toggleActions: 'play none none none' },
      }
    )

    // Recipe cards
    gsap.fromTo('.recipe-card',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: '.recipes-grid', start: 'top 80%', toggleActions: 'play none none none' },
      }
    )

    // Testimonial cards
    gsap.fromTo('.testimonial-card',
      { x: 40, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.testimonials-container', start: 'top 80%', toggleActions: 'play none none none' },
      }
    )

    // CTA heading text reveal
    const ctaChars = document.querySelectorAll('.cta-heading .char')
    if (ctaChars.length > 0) {
      gsap.fromTo(ctaChars,
        { yPercent: 100 },
        {
          yPercent: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.02,
          scrollTrigger: { trigger: '.cta-section', start: 'top 70%', toggleActions: 'play none none none' },
        }
      )
    }

    // Section heading text reveals
    const sectionHeadings = document.querySelectorAll('.section-heading-reveal')
    sectionHeadings.forEach(heading => {
      const chars = heading.querySelectorAll('.char')
      if (chars.length > 0) {
        gsap.fromTo(chars,
          { yPercent: 100 },
          {
            yPercent: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.02,
            scrollTrigger: { trigger: heading, start: 'top 80%', toggleActions: 'play none none none' },
          }
        )
      }
    })

  }, [isLoaded])

  /* ===== MAGNETIC BUTTONS ===== */
  useEffect(() => {
    if (!isLoaded) return

    const magneticBtns = document.querySelectorAll('.magnetic-btn')

    const handleMouseMove = (e: Event) => {
      const btn = e.currentTarget as HTMLElement
      const rect = btn.getBoundingClientRect()
      const mouseE = e as MouseEvent
      const x = mouseE.clientX - rect.left - rect.width / 2
      const y = mouseE.clientY - rect.top - rect.height / 2
      const dist = Math.sqrt(x * x + y * y)
      if (dist < 80) {
        gsap.to(btn, { x: x * 0.15, y: y * 0.15, duration: 0.3, ease: 'power2.out' })
      }
    }

    const handleMouseLeave = (e: Event) => {
      const btn = e.currentTarget as HTMLElement
      gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' })
    }

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', handleMouseMove)
      btn.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      magneticBtns.forEach(btn => {
        btn.removeEventListener('mousemove', handleMouseMove)
        btn.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [isLoaded])

  /* ===== NAV SCROLL HIGHLIGHT ===== */
  useEffect(() => {
    if (!isLoaded) return

    const sections = ['story', 'products', 'nutrition', 'recipes', 'testimonials']
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveNav(id),
        onEnterBack: () => setActiveNav(id),
      })
    })
  }, [isLoaded])

  /* ===== HELPERS ===== */
  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} style={{ display: 'inline-block', overflow: 'hidden' }}>
        <span className="char" style={{ display: 'inline-block' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      </span>
    ))
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  /* ===== RENDER ===== */
  return (
    <>
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: '1.5px solid #E8A000',
          mixBlendMode: 'difference',
          transform: 'translate(-100px, -100px)',
        }}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section relative" style={{ height: '100vh' }}>
        {/* Curtain - Infinity Scroll Background */}
        <div ref={curtainRef} className="curtain">
          <div className="curtain-glow" />

          {[0, 1, 2].map((stripIdx) => (
            <div
              key={stripIdx}
              ref={el => { stripsRef.current[stripIdx] = el }}
              className="strips"
            >
              {[0, 1].map((colIdx) => {
                const globalColIdx = stripIdx * 2 + colIdx
                return (
                  <div
                    key={colIdx}
                    ref={el => { columnsRef.current[globalColIdx] = el }}
                    className="column"
                  >
                    <div
                      ref={el => { columnInnersRef.current[globalColIdx] = el }}
                      className="column_inner"
                    >
                      {curtainImages.map((img, imgIdx) => (
                        <img
                          key={imgIdx}
                          src={img}
                          alt=""
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}

          <div className="vignette" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6" style={{ pointerEvents: 'none' }}>
          {/* 3D Floating Product Card */}
          <div className="hero-card-wrap" style={{ perspective: 1000, pointerEvents: 'auto' }}>
            <div
              style={{
                width: '28vw',
                minWidth: 280,
                maxWidth: 420,
                aspectRatio: '1/1',
                borderRadius: 24,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,248,240,0.2)',
                boxShadow: '0 25px 80px rgba(61,43,31,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                overflow: 'hidden',
                position: 'relative',
                animation: 'cardFloat 12s infinite ease-in-out',
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src="/images/hero-jar.jpg"
                alt="Uday's Peanut Butter"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 24 }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(8px, 0.7vw, 12px)',
                  letterSpacing: '0.15em',
                  color: 'rgba(255,248,240,0.6)',
                  textTransform: 'uppercase',
                }}
              >
                Uday&apos;s
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="mt-8 text-center" style={{ pointerEvents: 'auto' }}>
            <h1
              className="hero-line1"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(36px, 5vw, 80px)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: '#FFF8F0',
                textShadow: '0 4px 60px rgba(61,43,31,0.5)',
              }}
            >
              {splitText('PURE')}
            </h1>
            <h1
              className="hero-line2"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(36px, 5vw, 80px)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: '#FFF8F0',
                textShadow: '0 4px 60px rgba(61,43,31,0.5)',
              }}
            >
              {splitText('PEANUT POWER')}
            </h1>
          </div>

          {/* Sub-headline */}
          <p
            className="hero-sub mt-6 text-center"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(14px, 1.2vw, 20px)',
              lineHeight: 1.6,
              color: 'rgba(255,248,240,0.8)',
              maxWidth: 'clamp(300px, 36vw, 540px)',
              pointerEvents: 'auto',
            }}
          >
            Handcrafted with premium roasted peanuts. Rich in protein, naturally delicious.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-8 justify-center" style={{ pointerEvents: 'auto' }}>
            <button
              className="hero-cta-btn magnetic-btn"
              style={{
                borderRadius: 80,
                background: '#E8A000',
                color: '#3D2B1F',
                padding: 'clamp(10px, 0.9vw, 16px) clamp(24px, 2.5vw, 42px)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(12px, 0.9vw, 16px)',
                letterSpacing: '0.04em',
                boxShadow: '0 4px 20px rgba(232,160,0,0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.target as HTMLElement).style.boxShadow = '0 8px 30px rgba(232,160,0,0.4)'
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.transform = 'translateY(0)'
                ;(e.target as HTMLElement).style.boxShadow = '0 4px 20px rgba(232,160,0,0.3)'
              }}
            >
              Shop Now
            </button>
            <button
              className="hero-cta-btn magnetic-btn"
              onClick={() => scrollTo('story')}
              style={{
                borderRadius: 80,
                background: 'transparent',
                color: '#FFF8F0',
                padding: 'clamp(10px, 0.9vw, 16px) clamp(24px, 2.5vw, 42px)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(12px, 0.9vw, 16px)',
                letterSpacing: '0.04em',
                border: '1px solid rgba(255,248,240,0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.background = 'rgba(255,248,240,0.1)'
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.background = 'transparent'
              }}
            >
              Our Story
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator absolute bottom-8 flex flex-col items-center gap-2" style={{ opacity: 0 }}>
            <div style={{ position: 'relative', width: 1, height: 40, background: 'rgba(255,248,240,0.4)' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: -3,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#E8A000',
                  animation: 'scrollBounce 2s infinite ease-in-out',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(8px, 0.7vw, 11px)',
                color: 'rgba(255,248,240,0.5)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Scroll to explore
            </span>
          </div>
        </div>
      </section>

      {/* Spacer for pinned hero */}
      <div style={{ height: '200vh' }} />

      {/* ===== NAVIGATION ===== */}
      <nav
        ref={navRef}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-6 md:gap-10"
        style={{
          borderRadius: 80,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(255,248,240,0.9)',
          boxShadow: '0 4px 30px rgba(61,43,31,0.1)',
          padding: 'clamp(8px, 0.8vw, 14px) clamp(16px, 2vw, 32px)',
          opacity: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(14px, 1.2vw, 20px)',
            color: '#3D2B1F',
            whiteSpace: 'nowrap',
          }}
        >
          Uday&apos;s
        </span>

        <div className="hidden md:flex items-center gap-6">
          {[
            { label: 'Products', id: 'products' },
            { label: 'Story', id: 'story' },
            { label: 'Nutrition', id: 'nutrition' },
            { label: 'Recipes', id: 'recipes' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="relative"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(10px, 0.85vw, 13px)',
                color: activeNav === item.id ? '#E8A000' : '#5C3D1E',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.3s',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
              {activeNav === item.id && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#E8A000',
                  }}
                />
              )}
            </button>
          ))}
        </div>

        <button
          className="magnetic-btn"
          style={{
            borderRadius: 80,
            background: '#E8A000',
            color: '#FFF8F0',
            padding: 'clamp(6px, 0.6vw, 10px) clamp(14px, 2vw, 28px)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: 'clamp(10px, 0.85vw, 13px)',
            letterSpacing: '0.04em',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.transform = 'translateY(-2px)'
            ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(232,160,0,0.3)'
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.transform = 'translateY(0)'
            ;(e.target as HTMLElement).style.boxShadow = 'none'
          }}
        >
          Shop Now
        </button>
      </nav>

      {/* ===== STORY SECTION ===== */}
      <section id="story" className="relative" style={{ background: '#FFF8F0', padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 96px)', zIndex: 10 }}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 items-center">
          {/* Left - Content */}
          <div className="stagger-container">
            <span
              className="stagger-item block"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(10px, 0.75vw, 12px)',
                letterSpacing: '0.1em',
                color: '#E8A000',
                textTransform: 'uppercase',
              }}
            >
              OUR STORY
            </span>

            <h2
              className="stagger-item section-heading-reveal mt-3"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(28px, 3vw, 54px)',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                color: '#3D2B1F',
              }}
            >
              {splitText('From Farm to Jar')}
            </h2>

            <p
              className="stagger-item mt-6"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(14px, 1.1vw, 18px)',
                lineHeight: 1.7,
                color: '#5C3D1E',
                maxWidth: 520,
              }}
            >
              We source only the finest hand-picked peanuts from sustainable farms. Each batch is slow-roasted to perfection and stone-ground for an irresistibly smooth texture. No additives, no preservatives &mdash; just pure peanut goodness in every spoonful.
            </p>

            {/* Stats */}
            <div className="stagger-item flex flex-wrap gap-8 mt-8">
              {[
                { num: '100%', label: 'Natural' },
                { num: '0g', label: 'Added Sugar' },
                { num: '25g', label: 'Protein' },
              ].map(stat => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 800,
                      fontSize: 'clamp(24px, 2.5vw, 42px)',
                      color: '#E8A000',
                      lineHeight: 1,
                    }}
                  >
                    {stat.num}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: 'clamp(10px, 0.8vw, 13px)',
                      color: '#5C3D1E',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginTop: 4,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="stagger-item magnetic-btn mt-8"
              style={{
                borderRadius: 80,
                border: '1px solid #3D2B1F',
                color: '#3D2B1F',
                background: 'transparent',
                padding: 'clamp(10px, 0.8vw, 14px) clamp(20px, 2.2vw, 36px)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(12px, 0.9vw, 15px)',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                const t = e.currentTarget
                t.style.background = '#3D2B1F'
                t.style.color = '#FFF8F0'
              }}
              onMouseLeave={e => {
                const t = e.currentTarget
                t.style.background = 'transparent'
                t.style.color = '#3D2B1F'
              }}
            >
              Discover Our Process
            </button>
          </div>

          {/* Right - Image */}
          <div className="story-image" style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(61,43,31,0.15)' }}>
            <img
              src="/images/story-peanuts.jpg"
              alt="Premium peanuts"
              style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* ===== PRODUCT SHOWCASE ===== */}
      <section id="products" className="relative" style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #F5E6D0 100%)', padding: 'clamp(60px, 8vw, 120px) 0', zIndex: 10 }}>
        <div className="max-w-[1400px] mx-auto" style={{ padding: '0 clamp(24px, 6vw, 96px)' }}>
          {/* Header */}
          <div className="reveal-up flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: 'clamp(10px, 0.75vw, 12px)',
                  letterSpacing: '0.1em',
                  color: '#E8A000',
                  textTransform: 'uppercase',
                }}
              >
                OUR PRODUCTS
              </span>
              <h2
                className="section-heading-reveal mt-2"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(28px, 3vw, 54px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                  color: '#3D2B1F',
                }}
              >
                {splitText('Four Delicious Variants')}
              </h2>
            </div>
            <button
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(12px, 0.9vw, 15px)',
                color: '#E8A000',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              View All <span style={{ fontSize: '1.2em' }}>&rarr;</span>
            </button>
          </div>
        </div>

        {/* Products */}
        <div className="products-container flex gap-6 overflow-x-auto" style={{ padding: '0 clamp(24px, 6vw, 96px)', scrollbarWidth: 'none' }}>
          {products.map(product => (
            <div
              key={product.name}
              className="product-card flex-shrink-0"
              style={{
                width: 'clamp(260px, 28vw, 380px)',
                minWidth: 260,
                borderRadius: 20,
                background: '#FFFFFF',
                padding: 'clamp(16px, 2vw, 28px)',
                boxShadow: '0 10px 40px rgba(61,43,31,0.08)',
                transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                const card = e.currentTarget
                card.style.transform = 'translateY(-8px)'
                card.style.boxShadow = '0 20px 50px rgba(61,43,31,0.15)'
                const img = card.querySelector('img')
                if (img) (img as HTMLElement).style.transform = 'scale(1.05)'
              }}
              onMouseLeave={e => {
                const card = e.currentTarget
                card.style.transform = 'translateY(0)'
                card.style.boxShadow = '0 10px 40px rgba(61,43,31,0.08)'
                const img = card.querySelector('img')
                if (img) (img as HTMLElement).style.transform = 'scale(1)'
              }}
            >
              <div style={{ borderRadius: 16, overflow: 'hidden', background: '#F5E6D0', aspectRatio: '1/1' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
                />
              </div>
              <div style={{ marginTop: 'clamp(12px, 1.5vw, 20px)' }}>
                <h3
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: 'clamp(15px, 1.2vw, 20px)',
                    color: '#3D2B1F',
                  }}
                >
                  {product.name}
                </h3>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(12px, 0.9vw, 15px)',
                    color: '#5C3D1E',
                    marginTop: 4,
                  }}
                >
                  {product.desc}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 800,
                      fontSize: 'clamp(16px, 1.4vw, 22px)',
                      color: '#E8A000',
                    }}
                  >
                    {product.price}
                  </span>
                  <button
                    style={{
                      borderRadius: 80,
                      background: '#E8A000',
                      color: '#FFF8F0',
                      padding: 'clamp(6px, 0.5vw, 10px) clamp(14px, 1.5vw, 24px)',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: 'clamp(11px, 0.8vw, 13px)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLElement).style.background = '#C27A00'
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.background = '#E8A000'
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== NUTRITION HIGHLIGHTS ===== */}
      <section id="nutrition" className="relative overflow-hidden" style={{ background: '#3D2B1F', padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 96px)', zIndex: 10 }}>
        {/* Decorative peanut outlines */}
        <svg
          style={{ position: 'absolute', top: '-10vw', right: '-5vw', width: '25vw', opacity: 0.08, animation: 'slowRotate 60s linear infinite' }}
          viewBox="0 0 100 100"
          fill="none"
        >
          <ellipse cx="50" cy="50" rx="35" ry="45" stroke="#E8A000" strokeWidth="1" />
          <path d="M50 5 Q55 25 50 50 Q45 75 50 95" stroke="#E8A000" strokeWidth="1" />
        </svg>
        <svg
          style={{ position: 'absolute', bottom: '-8vw', left: '-3vw', width: '25vw', opacity: 0.08, animation: 'slowRotate 60s linear infinite reverse' }}
          viewBox="0 0 100 100"
          fill="none"
        >
          <ellipse cx="50" cy="50" rx="35" ry="45" stroke="#E8A000" strokeWidth="1" />
          <path d="M50 5 Q55 25 50 50 Q45 75 50 95" stroke="#E8A000" strokeWidth="1" />
        </svg>

        <div className="max-w-[1400px] mx-auto text-center">
          <span
            className="reveal-up block"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 'clamp(10px, 0.75vw, 12px)',
              letterSpacing: '0.1em',
              color: '#E8A000',
              textTransform: 'uppercase',
            }}
          >
            NUTRITION
          </span>

          <h2
            className="reveal-up section-heading-reveal mt-3"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(28px, 3vw, 54px)',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              color: '#FFF8F0',
            }}
          >
            {splitText('Packed with Natural Goodness')}
          </h2>

          <p
            className="reveal-up mx-auto mt-6"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(14px, 1.1vw, 18px)',
              lineHeight: 1.7,
              color: 'rgba(255,248,240,0.75)',
              maxWidth: 600,
            }}
          >
            Every jar of Uday&apos;s is a powerhouse of nutrition. High-quality protein, heart-healthy fats, and essential vitamins &mdash; all from nature&apos;s finest peanuts. Fuel your body with something real.
          </p>

          {/* Nutrition Icons */}
          <div className="nutrition-icons-row flex flex-wrap justify-center gap-8 md:gap-12 mt-12 md:mt-16">
            {nutritionStats.map(stat => (
              <div key={stat.label} className="nutrition-icon flex flex-col items-center">
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(232,160,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8A000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={stat.icon} />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 800,
                    fontSize: 'clamp(24px, 2vw, 36px)',
                    color: '#FFF8F0',
                    marginTop: 12,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: 'clamp(10px, 0.8vw, 13px)',
                    color: 'rgba(255,248,240,0.6)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECIPE INSPIRATION ===== */}
      <section id="recipes" className="relative" style={{ background: '#F5E6D0', padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 96px)', zIndex: 10 }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="reveal-up text-center mb-12">
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(10px, 0.75vw, 12px)',
                letterSpacing: '0.1em',
                color: '#E8A000',
                textTransform: 'uppercase',
              }}
            >
              RECIPES
            </span>
            <h2
              className="section-heading-reveal mt-2"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(28px, 3vw, 54px)',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                color: '#3D2B1F',
              }}
            >
              {splitText('Beyond the Spread')}
            </h2>
          </div>

          {/* Recipe Grid */}
          <div className="recipes-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.map(recipe => (
              <div
                key={recipe.name}
                className="recipe-card relative overflow-hidden cursor-pointer"
                style={{
                  borderRadius: 20,
                  aspectRatio: '16/10',
                }}
                onMouseEnter={e => {
                  const card = e.currentTarget
                  const img = card.querySelector('img')
                  if (img) (img as HTMLElement).style.transform = 'scale(1.05)'
                }}
                onMouseLeave={e => {
                  const card = e.currentTarget
                  const img = card.querySelector('img')
                  if (img) (img as HTMLElement).style.transform = 'scale(1)'
                }}
              >
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(61,43,31,0.8) 0%, transparent 50%)',
                  }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, padding: 'clamp(16px, 2vw, 28px)' }}>
                  <h3
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: 'clamp(16px, 1.5vw, 24px)',
                      color: '#FFF8F0',
                    }}
                  >
                    {recipe.name}
                  </h3>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: 'clamp(12px, 0.8vw, 14px)',
                      color: 'rgba(255,248,240,0.7)',
                      marginTop: 4,
                      display: 'block',
                    }}
                  >
                    {recipe.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal-up text-center mt-10">
            <button
              className="magnetic-btn"
              style={{
                borderRadius: 80,
                border: '1px solid #3D2B1F',
                color: '#3D2B1F',
                background: 'transparent',
                padding: 'clamp(10px, 0.8vw, 14px) clamp(24px, 2.2vw, 36px)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(12px, 0.9vw, 15px)',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                const t = e.currentTarget
                t.style.background = '#3D2B1F'
                t.style.color = '#FFF8F0'
              }}
              onMouseLeave={e => {
                const t = e.currentTarget
                t.style.background = 'transparent'
                t.style.color = '#3D2B1F'
              }}
            >
              Explore All Recipes
            </button>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="relative" style={{ background: '#FFF8F0', padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 96px)', zIndex: 10 }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="reveal-up text-center mb-12">
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(10px, 0.75vw, 12px)',
                letterSpacing: '0.1em',
                color: '#E8A000',
                textTransform: 'uppercase',
              }}
            >
              REVIEWS
            </span>
            <h2
              className="section-heading-reveal mt-2"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(28px, 3vw, 54px)',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                color: '#3D2B1F',
              }}
            >
              {splitText('Loved by Thousands')}
            </h2>
          </div>

          {/* Testimonials Carousel */}
          <div
            className="testimonials-container flex gap-6 overflow-x-auto pb-4"
            style={{
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'thin',
              msOverflowStyle: 'none',
              maskImage: 'linear-gradient(to right, transparent, black 2%, black 98%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 2%, black 98%, transparent)',
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="testimonial-card flex-shrink-0"
                style={{
                  minWidth: 'clamp(280px, 30vw, 380px)',
                  maxWidth: 420,
                  scrollSnapAlign: 'start',
                  background: '#FFFFFF',
                  borderRadius: 20,
                  padding: 'clamp(20px, 2.5vw, 36px)',
                  boxShadow: '0 8px 30px rgba(61,43,31,0.06)',
                }}
              >
                {/* Stars */}
                <div style={{ color: '#E8A000', fontSize: 'clamp(12px, 1vw, 16px)', letterSpacing: 2 }}>
                  {'\u2605'.repeat(t.rating)}
                </div>

                {/* Quote */}
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(13px, 1vw, 16px)',
                    lineHeight: 1.6,
                    color: '#5C3D1E',
                    fontStyle: 'italic',
                    marginTop: 12,
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-6">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: 'clamp(12px, 0.9vw, 14px)',
                        color: '#3D2B1F',
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: 'clamp(11px, 0.8vw, 13px)',
                        color: '#5C3D1E',
                      }}
                    >
                      {t.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-section relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #E8A000 0%, #C27A00 100%)', padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 96px)', zIndex: 10, minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Decorative floating jars */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 3) * 20}%`,
              opacity: 0.06,
              color: '#FFF8F0',
              fontSize: 'clamp(60px, 8vw, 120px)',
              animation: `float ${18 + i * 4}s infinite ease-in-out`,
              animationDelay: `${i * 2}s`,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2h10v4h-1v2h1v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8h1V6H7V2zm3 2v2h4V4h-4zM9 8v12h6V8H9z" />
            </svg>
          </div>
        ))}

        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2
            className="cta-heading"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(28px, 3.5vw, 60px)',
              lineHeight: 1.1,
              color: '#FFF8F0',
            }}
          >
            {splitText('Start Your Peanut Butter Journey')}
          </h2>

          <p
            className="reveal-up mt-6"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(14px, 1.1vw, 18px)',
              lineHeight: 1.7,
              color: 'rgba(255,248,240,0.9)',
              maxWidth: 500,
              margin: '24px auto 0',
            }}
          >
            Experience the richness of pure, handcrafted peanut butter. Order now and get free shipping on your first jar.
          </p>

          <button
            className="magnetic-btn reveal-up mt-8"
            style={{
              borderRadius: 80,
              background: '#3D2B1F',
              color: '#FFF8F0',
              padding: 'clamp(12px, 1vw, 18px) clamp(28px, 3vw, 48px)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(13px, 1vw, 17px)',
              letterSpacing: '0.04em',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(61,43,31,0.3)',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.transform = 'translateY(-2px)'
              ;(e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(61,43,31,0.4)'
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.transform = 'translateY(0)'
              ;(e.target as HTMLElement).style.boxShadow = '0 8px 30px rgba(61,43,31,0.3)'
            }}
          >
            Shop Now &mdash; Free Shipping
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative" style={{ background: '#3D2B1F', padding: 'clamp(40px, 6vw, 80px) clamp(24px, 6vw, 96px)', zIndex: 10 }}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(18px, 1.5vw, 26px)',
                color: '#FFF8F0',
              }}
            >
              Uday&apos;s
            </span>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(12px, 0.9vw, 14px)',
                color: 'rgba(255,248,240,0.6)',
                marginTop: 8,
              }}
            >
              Pure Peanut Power
            </p>
            <div className="flex gap-4 mt-6">
              {['Instagram', 'Facebook', 'Twitter'].map(social => (
                <button
                  key={social}
                  style={{
                    color: 'rgba(255,248,240,0.6)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.3s',
                    padding: 0,
                  }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.color = '#E8A000' }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(255,248,240,0.6)' }}
                  title={social}
                >
                  <SocialIcon name={social} />
                </button>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(12px, 0.9vw, 14px)',
                color: '#FFF8F0',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Shop
            </h4>
            <ul className="mt-4 space-y-3">
              {['Classic Smooth', 'Extra Crunchy', 'Honey Blend', 'Chocolate Swirl'].map(link => (
                <li key={link}>
                  <a
                    href="#"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: 'clamp(12px, 0.85vw, 13px)',
                      color: 'rgba(255,248,240,0.6)',
                      textDecoration: 'none',
                      transition: 'color 0.3s',
                    }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.color = '#E8A000' }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(255,248,240,0.6)' }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(12px, 0.9vw, 14px)',
                color: '#FFF8F0',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Company
            </h4>
            <ul className="mt-4 space-y-3">
              {['Our Story', 'Nutrition', 'Recipes', 'Contact'].map(link => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: 'clamp(12px, 0.85vw, 13px)',
                      color: 'rgba(255,248,240,0.6)',
                      textDecoration: 'none',
                      transition: 'color 0.3s',
                    }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.color = '#E8A000' }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(255,248,240,0.6)' }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(12px, 0.9vw, 14px)',
                color: '#FFF8F0',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Support
            </h4>
            <ul className="mt-4 space-y-3">
              {['Shipping Info', 'Returns', 'FAQ', 'Privacy Policy'].map(link => (
                <li key={link}>
                  <a
                    href="#"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: 'clamp(12px, 0.85vw, 13px)',
                      color: 'rgba(255,248,240,0.6)',
                      textDecoration: 'none',
                      transition: 'color 0.3s',
                    }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.color = '#E8A000' }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(255,248,240,0.6)' }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="max-w-[1400px] mx-auto flex flex-wrap justify-between items-center gap-4 mt-12 pt-6"
          style={{ borderTop: '1px solid rgba(255,248,240,0.1)' }}
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(10px, 0.75vw, 12px)',
              color: 'rgba(255,248,240,0.4)',
            }}
          >
            &copy; 2025 Uday&apos;s Peanut Butter. All rights reserved.
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(10px, 0.75vw, 12px)',
              color: 'rgba(255,248,240,0.4)',
            }}
          >
            Crafted with love in India
          </span>
        </div>
      </footer>
    </>
  )
}

/* ===== SOCIAL ICONS ===== */
function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, React.JSX.Element> = {
    Instagram: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    Facebook: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    Twitter: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    ),
  }
  return icons[name] || null
}
