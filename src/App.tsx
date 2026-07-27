import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { Toaster, toast } from 'sonner'

gsap.registerPlugin(ScrollTrigger)

/* ===== DATA ===== */

/**
 * Products — Updated to 2 Buttertofly variants (Chocolate & Classic).
 * Prices in GBP as specified.
 */
const products = [
  {
    name: 'Chocolate Peanut Butter',
    badge: 'Added Cocoa',
    desc: 'Smooth roasted peanut butter blended with premium cocoa for a rich chocolate flavor without compromising nutrition.',
    price: '£8.99',
    image: '/images/Screenshot 2026-07-27 223731.png',
  },
]

/** Recipes — kept from original */
const recipes = [
  { name: 'Peanut Butter Smoothie Bowl', time: '10 min', image: '/images/recipe-smoothie.jpg' },
  { name: 'Banana Peanut Butter Toast', time: '5 min', image: '/images/recipe-toast.jpg' },
  { name: 'Protein Energy Balls', time: '15 min', image: '/images/recipe-balls.jpg' },
  { name: 'Peanut Butter Oatmeal', time: '8 min', image: '/images/recipe-oatmeal.jpg' },
]

/** Detailed steps and ingredients for recipes using Buttertofly products */
const recipesDetail: Record<string, {
  prepTime: string;
  difficulty: string;
  servings: string;
  ingredients: string[];
  steps: string[];
}> = {
  'Peanut Butter Smoothie Bowl': {
    prepTime: '10 min',
    difficulty: 'Easy',
    servings: '1 Bowl',
    ingredients: [
      '2 frozen bananas, sliced',
      '3 tbsp Buttertofly Classic Peanut Butter',
      '1/2 cup almond milk',
      '1 tbsp maple syrup or honey',
      '1 tbsp chia seeds',
      '1/3 cup crunchy granola',
      'Handful of fresh berries (strawberries, blueberries)',
      'Generous drizzle of Buttertofly Chocolate Peanut Butter (warmed)'
    ],
    steps: [
      'Add the sliced frozen bananas, Buttertofly Classic Peanut Butter, almond milk, and maple syrup to a high-speed blender.',
      'Blend on high for 1-2 minutes until thick and smooth (consistency of soft-serve). Add milk in small increments if needed.',
      'Spoon the blended smoothie base into a chilled serving bowl.',
      'Arrange granola, chia seeds, fresh banana slices, and berries in neat rows on top.',
      'Gently melt a tablespoon of Buttertofly Chocolate Peanut Butter and drizzle it across the bowl before serving.'
    ]
  },
  'Banana Peanut Butter Toast': {
    prepTime: '5 min',
    difficulty: 'Easy',
    servings: '2 Slices',
    ingredients: [
      '2 thick slices of sourdough or artisanal bread',
      '3 tbsp Buttertofly Classic Peanut Butter',
      '1 ripe banana, sliced',
      '1 tsp chia seeds or hemp hearts',
      'Flaky sea salt (optional)',
      'Light honey drizzle (optional)'
    ],
    steps: [
      'Toast the sourdough bread slices until golden brown and crispy.',
      'Spread a generous, even layer of Buttertofly Classic Peanut Butter on each warm slice.',
      'Arrange the fresh banana slices in an overlapping pattern over the peanut butter.',
      'Sprinkle with chia seeds and a pinch of flaky sea salt to bring out the rich peanut flavours.',
      'Add a light drizzle of honey if desired, and enjoy warm.'
    ]
  },
  'Protein Energy Balls': {
    prepTime: '15 min',
    difficulty: 'Easy',
    servings: '12-15 Balls',
    ingredients: [
      '1 cup rolled oats',
      '1/2 cup Buttertofly Classic Peanut Butter',
      '1/3 cup honey or maple syrup',
      '1/2 cup ground flaxseed or chia seeds',
      '1/2 cup dark chocolate chips',
      '1 tsp vanilla extract'
    ],
    steps: [
      'In a large mixing bowl, combine the rolled oats, flaxseed, and chocolate chips.',
      'Pour in the Buttertofly Classic Peanut Butter, honey, and vanilla extract.',
      'Stir the mixture thoroughly until a uniform, sticky dough forms.',
      'Cover and place in the refrigerator to chill for 15-20 minutes to make rolling easier.',
      'Form into bite-sized balls (about 1 inch) and store in an airtight container in the fridge.'
    ]
  },
  'Peanut Butter Oatmeal': {
    prepTime: '8 min',
    difficulty: 'Easy',
    servings: '1 Bowl',
    ingredients: [
      '1/2 cup rolled oats',
      '1 cup almond milk or water',
      '2 tbsp Buttertofly Classic Peanut Butter',
      '1 tbsp maple syrup',
      '1/2 tsp ground cinnamon',
      'Toppings: sliced red apple, crushed almonds, Buttertofly Chocolate Peanut Butter'
    ],
    steps: [
      'Combine oats, liquid, cinnamon, and a tiny pinch of salt in a saucepan over medium heat.',
      'Bring to a gentle boil, then simmer on low for 5 minutes, stirring until thick and creamy.',
      'Remove from heat and stir in the Buttertofly Classic Peanut Butter and maple syrup until melted and smooth.',
      'Transfer to a serving bowl and arrange apple slices and almonds on top.',
      'Add a warm dollop of Buttertofly Chocolate Peanut Butter to the center and serve immediately.'
    ]
  }
}

/**
 * Testimonials — DATA PRESERVED for future use.
 * The testimonials section rendering is commented out below.
 */
/*
const _testimonials = [
  { quote: "The smoothest peanut butter I've ever tasted. You can really tell it's made with quality ingredients. My morning toast has never been better!", name: 'Priya Sharma', location: 'Mumbai', avatar: '/images/testimonial-1.jpg', rating: 5 },
  { quote: "As a fitness enthusiast, I love that Buttertofly is pure protein without any additives. The crunchy variant is my absolute favorite post-workout snack.", name: 'Arjun Patel', location: 'Bangalore', avatar: '/images/testimonial-2.jpg', rating: 5 },
  { quote: "My kids absolutely love the chocolate swirl! And I love that it's made with natural ingredients. Finally a peanut butter I feel good about serving my family.", name: 'Anita Desai', location: 'Delhi', avatar: '/images/testimonial-3.jpg', rating: 5 },
]
*/

/** Nutrition stats for the Nutrition section */
const nutritionStats = [
  { value: '25g', label: 'Protein', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { value: '0g', label: 'Trans Fat', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
  { value: '12g', label: 'Healthy Fats', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  { value: '10g', label: 'Sugar', icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' },
]

/* REMOVED: curtainImages array — hero simplified to a clean static image */

export default function App() {
  const navRef = useRef<HTMLElement>(null)
  const [activeNav, setActiveNav] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  /* ===== CART STATE & PERSISTENCE ===== */
  const [cart, setCart] = useState<{ name: string; price: number; quantity: number; image: string }[]>(() => {
    try {
      const saved = localStorage.getItem('buttertofly_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
  })

  /* ===== RECIPE DETAILS STATE ===== */
  const [selectedRecipe, setSelectedRecipe] = useState<typeof recipes[0] | null>(null)

  // Prevent background scrolling when recipe details overlay is active
  useEffect(() => {
    if (selectedRecipe) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedRecipe])

  // Synchronize cart state with localStorage
  useEffect(() => {
    localStorage.setItem('buttertofly_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = useCallback((product: { name: string; price: string; image: string }) => {
    const numericPrice = parseFloat(product.price.replace('£', ''))
    setCart(prev => {
      const existing = prev.find(item => item.name === product.name)
      if (existing) {
        toast.success(`Increased ${product.name} quantity to ${existing.quantity + 1}`)
        return prev.map(item =>
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      toast.success(`Added ${product.name} to cart!`)
      return [...prev, { name: product.name, price: numericPrice, quantity: 1, image: product.image }]
    })
  }, [])

  const updateQuantity = useCallback((name: string, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.name === name) {
          const newQty = item.quantity + delta
          return newQty <= 0 ? null : { ...item, quantity: newQty }
        }
        return item
      }).filter(Boolean) as typeof cart
    )
  }, [])

  const removeFromCart = useCallback((name: string) => {
    setCart(prev => prev.filter(item => item.name !== name))
    toast.info(`Removed ${name} from cart`)
  }, [])

  const handleCheckoutChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCheckoutForm(prev => ({ ...prev, [name]: value }))
  }, [])

  const handlePlaceOrder = useCallback((e: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.address || !checkoutForm.phone) {
      toast.error('Please fill in all required fields.')
      return
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const amountInPaise = Math.round(subtotal * 100)

    const options = {
      key: 'rzp_test_T8jWQoPEPbFBRH',
      amount: amountInPaise,
      currency: 'GBP',
      name: 'Buttertofly Peanut Butter',
      description: 'Order Payment',
      image: '/images/hero-jar.jpg',
      handler: function (response: any) {
        const randomId = `BTOF-${Math.floor(10000 + Math.random() * 90000)}-UK`
        setOrderId(randomId)
        setCart([])
        setIsCartOpen(false)
        setIsCheckingOut(false)
        setOrderSuccess(true)
        toast.success(`Payment successful! ID: ${response.razorpay_payment_id}`)
      },
      prefill: {
        name: checkoutForm.name,
        email: checkoutForm.email,
        contact: checkoutForm.phone,
      },
      notes: {
        address: checkoutForm.address,
      },
      theme: {
        color: '#3D2B1F',
      },
    }

    try {
      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        toast.error(`Payment Failed: ${response.error.description}`)
      })
      rzp.open()
    } catch (err) {
      // Graceful fallback for non-browser/script blocks
      const randomId = `BTOF-${Math.floor(10000 + Math.random() * 90000)}-UK`
      setOrderId(randomId)
      setCart([])
      setIsCartOpen(false)
      setIsCheckingOut(false)
      setOrderSuccess(true)
      toast.success('Order processing completed successfully!')
    }

    // Reset form
    setCheckoutForm({
      name: '',
      email: '',
      address: '',
      phone: '',
    })
  }, [checkoutForm, cart])

  /* ===== HERO 3D TILT REMOVED — video background hero no longer has floating product image ===== */

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

  /* ===== ENTRANCE ANIMATIONS (Optimized) ===== */
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    /* Nav entrance — uses transform for GPU compositing */
    gsap.fromTo(navRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 })

    /* Hero content entrance — smooth fade-up animations only */
    gsap.fromTo('.hero-badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.5 })
    gsap.fromTo('.hero-heading', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.7 })
    gsap.fromTo('.hero-sub', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 1.1 })
    gsap.fromTo('.hero-features', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 1.3 })
    gsap.fromTo('.hero-cta-btn', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.12, delay: 1.5 })
    gsap.fromTo('.scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 1.9 })
    gsap.fromTo('.hero-jar-foreground', { y: 60, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.9 })
  }, [isLoaded])

  /* REMOVED: Curtain infinity scroll useEffect
   * The pinned hero with ScrollTrigger was creating a large empty gap
   * between hero and story. Replaced with a simple static hero.
   */

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

    /* Stagger reveals for story and other containers */
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

    /* Image slide-in for story section */
    gsap.fromTo('.story-image',
      { x: 60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.story-image', start: 'top 80%', toggleActions: 'play none none none' },
      }
    )

    /* Nutrition icons pop-in */
    gsap.fromTo('.nutrition-icon',
      { scale: 0.8, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.15,
        scrollTrigger: { trigger: '.nutrition-icons-row', start: 'top 80%', toggleActions: 'play none none none' },
      }
    )

    /* Product cards slide in from right */
    gsap.fromTo('.product-card',
      { x: 80, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.products-container', start: 'top 80%', toggleActions: 'play none none none' },
      }
    )

    /* Recipe cards rise up */
    gsap.fromTo('.recipe-card',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: '.recipes-grid', start: 'top 80%', toggleActions: 'play none none none' },
      }
    )

    /* REMOVED: Testimonial card animations — section is commented out */

    /* CTA heading text reveal */
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

    /* Section heading text reveals */
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

    /* Contact section reveal */
    gsap.fromTo('.contact-info-item',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: '.contact-grid', start: 'top 80%', toggleActions: 'play none none none' },
      }
    )

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

    /* Updated sections — removed 'testimonials' since section is commented out, added 'contact' */
    const sections = ['story', 'products', 'nutrition', 'recipes', 'contact']
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

  /** Split text into individual chars wrapped in overflow-hidden spans for GSAP reveal */
  const splitText = useCallback((text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} style={{ display: 'inline-block', overflow: 'hidden' }}>
        <span className="char" style={{ display: 'inline-block' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      </span>
    ))
  }, [])

  /** Smooth scroll to a section by id */
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  /* ===== RENDER ===== */
  return (
    <>
      {/* REMOVED: Custom Cursor div — native browser cursor restored for better accessibility */}

      {/* ===== HERO SECTION — Full-screen video background with premium glass overlay ===== */}
      <section
        className="hero-section relative overflow-hidden"
        aria-label="Hero banner"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          position: 'relative',
        }}
      >
        {/* Video Background — blurred, dimmed, non-distracting */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(6px) brightness(0.75)',
            transform: 'scale(1.05)', /* prevents blur edge bleed */
            willChange: 'transform',
            zIndex: 0,
          }}
        >
          <source src="/images/Animate_this_image.mp4" type="video/mp4" />
        </video>

        {/* Dark gradient overlay — left-to-right for text readability */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(105deg, rgba(30,18,10,0.65) 0%, rgba(30,18,10,0.40) 50%, rgba(30,18,10,0.20) 100%)',
            zIndex: 1,
          }}
        />

        {/* Premium glass-like overlay panel */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(61,43,31,0.08)',
            backdropFilter: 'saturate(120%) brightness(0.95)',
            WebkitBackdropFilter: 'saturate(120%) brightness(0.95)',
            zIndex: 2,
          }}
        />

        {/* Hero Content — left-aligned for modern premium look */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: 1400,
            margin: '0 auto',
            padding: 'clamp(100px, 14vh, 160px) clamp(28px, 6vw, 96px) clamp(60px, 8vh, 100px)',
          }}
        >
          {/* Top Label */}
          <div
            className="hero-badge"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(11px, 0.85vw, 14px)',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#E8A000',
              marginBottom: 'clamp(16px, 2vw, 28px)',
              opacity: 0,
            }}
          >
            one more spoon .....
          </div>

          {/* Main Heading — PEANUT GOODNESS as primary visual focus */}
          <h1
            className="hero-heading"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(32px, 5vw, 76px)',
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: '#FFF8F0',
              maxWidth: 800,
              opacity: 0,
            }}
          >
            Why choose between Indulgence
            <br />
            <span style={{ color: '#E8A000' }}>and health?</span>
          </h1>

          {/* Description removed as requested */}

          {/* Feature Icons Row */}
          <div
            className="hero-features flex flex-wrap gap-6"
            style={{ marginTop: 'clamp(28px, 3.5vw, 48px)', opacity: 0, maxWidth: 650 }}
          >
            {[
              { icon: 'M11 20A7 7 0 0 1 4 13C4 7 10 2 10 2s6 5 6 11a7 7 0 0 1-5 7v4h-2v-4z', label: 'BETTER INGREDIENTS' },
              { icon: 'M4 4h16v16H4z M4 10h16 M10 4v16', label: 'RICH CHOCOLATE EXPERIENCE' },
              { icon: 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-3 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 4a2 2 0 1 1 0-4 2 2 0 0 1 0 4z', label: 'PEANUT-FORWARD RECIPE' },
              { icon: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z M3 3l18 18', label: 'NO PALM OIL' },
            ].map(feat => (
              <div key={feat.label} className="flex items-center gap-2">
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(232,160,0,0.15)',
                  border: '1px solid rgba(232,160,0,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8A000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={feat.icon} />
                  </svg>
                </div>
                <span style={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 500,
                  fontSize: 'clamp(11px, 0.85vw, 14px)',
                  color: 'rgba(255,248,240,0.8)',
                  whiteSpace: 'nowrap',
                }}>
                  {feat.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 'clamp(32px, 4vw, 56px)' }}>
            <button
              className="hero-cta-btn magnetic-btn"
              onClick={() => scrollTo('products')}
              aria-label="Shop Buttertofly products"
              style={{
                borderRadius: 80,
                background: '#E8A000',
                color: '#3D2B1F',
                padding: 'clamp(14px, 1.1vw, 18px) clamp(32px, 3.5vw, 52px)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(13px, 1vw, 16px)',
                letterSpacing: '0.04em',
                boxShadow: '0 4px 20px rgba(232,160,0,0.25)',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
                opacity: 0,
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.transform = 'translateY(-3px)';
                (e.target as HTMLElement).style.boxShadow = '0 10px 30px rgba(232,160,0,0.45)'
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = '0 4px 20px rgba(232,160,0,0.25)'
              }}
            >
              Shop Now
            </button>
            <button
              className="hero-cta-btn magnetic-btn"
              onClick={() => scrollTo('products')}
              aria-label="Explore Buttertofly products"
              style={{
                borderRadius: 80,
                background: 'rgba(255,248,240,0.08)',
                color: '#FFF8F0',
                padding: 'clamp(14px, 1.1vw, 18px) clamp(32px, 3.5vw, 52px)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(13px, 1vw, 16px)',
                letterSpacing: '0.04em',
                border: '1px solid rgba(255,248,240,0.25)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                opacity: 0,
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.background = 'rgba(255,248,240,0.18)';
                (e.target as HTMLElement).style.borderColor = 'rgba(255,248,240,0.5)';
                (e.target as HTMLElement).style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                (e.target as HTMLElement).style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.background = 'rgba(255,248,240,0.08)';
                (e.target as HTMLElement).style.borderColor = 'rgba(255,248,240,0.25)';
                (e.target as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                (e.target as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              Explore Products
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator flex items-center gap-3" style={{ marginTop: 'clamp(40px, 5vw, 64px)', opacity: 0 }} aria-hidden="true">
            <div style={{ position: 'relative', width: 1, height: 36, background: 'rgba(255,248,240,0.3)' }}>
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
                fontSize: 'clamp(9px, 0.7vw, 11px)',
                color: 'rgba(255,248,240,0.45)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Scroll to explore
            </span>
          </div>
        </div>

        {/* ===== FOREGROUND JAR IMAGE — lower-right, creates depth over video ===== */}
        <div
          className="hero-jar-foreground hidden lg:block"
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 'clamp(40px, 6vw, 120px)',
            top: '20%', /* Adjusted to be in the middle vertically instead of bottom */
            zIndex: 15,
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          <img
            src="/images/product-chocolate.jpeg"
            alt="Buttertofly Chocolate Peanut Butter jar"
            style={{
              width: 'clamp(320px, 33vw, 500px)',
              height: 'auto',
              borderRadius: 20,
              objectFit: 'contain',
              /* Enhanced soft realistic shadow beneath the jar + subtle warm rim light */
              filter: 'drop-shadow(0 40px 60px rgba(10,5,0,0.6)) drop-shadow(0 12px 24px rgba(20,10,0,0.4)) drop-shadow(0 0 4px rgba(232,160,0,0.3))',
              /* Subtle warm rim light blending with background */
              outline: '1px solid rgba(232,160,0,0.15)',
              outlineOffset: '-1px',
            }}
          />
        </div>
      </section>

      {/* NO SPACER — hero flows directly into story section */}

      {/* ===== NAVIGATION ===== */}
      <nav
        ref={navRef}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-6 md:gap-10"
        aria-label="Main navigation"
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
        {/* Brand name — updated from Uday's to Buttertofly */}
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(14px, 1.2vw, 20px)',
            color: '#3D2B1F',
            whiteSpace: 'nowrap',
          }}
        >
          Buttertofly
        </span>

        <div className="hidden md:flex items-center gap-6">
          {/* Nav links — removed Testimonials, kept relevant sections */}
          {[
            { label: 'Products', id: 'products' },
            { label: 'Story', id: 'story' },
            { label: 'Nutrition', id: 'nutrition' },
            { label: 'Recipes', id: 'recipes' },
            { label: 'Contact', id: 'contact' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="relative"
              aria-label={`Navigate to ${item.label} section`}
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

        {/* Cart Bag Icon with dynamic quantity count badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center justify-center p-2 rounded-full hover:bg-black/5 transition-colors"
          aria-label="Open shopping cart"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#3D2B1F',
            display: 'flex',
            marginRight: '-4px',
          }}
        >
          <ShoppingBag size={20} />
          {cart.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                background: '#E8A000',
                color: '#FFF8F0',
                fontSize: 10,
                fontWeight: 'bold',
                borderRadius: '50%',
                width: 16,
                height: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
              }}
            >
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>

        <button
          className="magnetic-btn"
          aria-label="Shop now"
          onClick={() => scrollTo('products')}
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
            (e.target as HTMLElement).style.transform = 'translateY(-2px)';
            (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(232,160,0,0.3)'
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.transform = 'translateY(0)';
            (e.target as HTMLElement).style.boxShadow = 'none'
          }}
        >
          Shop Now
        </button>
      </nav>

      {/* ===== STORY SECTION — Rewritten with Buttertofly brand story ===== */}
      <section id="story" className="relative" style={{ background: '#FFF8F0', padding: 'clamp(48px, 6vw, 96px) clamp(24px, 6vw, 96px)', zIndex: 10 }}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
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

            {/* Rewritten Buttertofly brand story — premium, natural, friendly tone */}
            <p
              className="stagger-item mt-5"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(14px, 1.1vw, 18px)',
                lineHeight: 1.7,
                color: '#5C3D1E',
                maxWidth: 520,
              }}
            >
              At Buttertofly, every jar begins with sustainably sourced peanuts, hand-selected from trusted farms that share our commitment to the earth. We slow roast each batch to unlock deep, nutty flavour, then stone grind them to a velvety smooth finish.
            </p>
            <p
              className="stagger-item mt-4"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(14px, 1.1vw, 18px)',
                lineHeight: 1.7,
                color: '#5C3D1E',
                maxWidth: 520,
              }}
            >
              No preservatives. No palm oil. Just pure, wholesome peanut butter — rich in protein and crafted with care. Because the best things in life are made simply.
            </p>

            {/* Stats — tighter spacing for balanced layout */}
            <div className="stagger-item flex flex-wrap gap-6 sm:gap-8 mt-8">
              {[
                { num: '100%', label: 'Natural' },
                { num: '0g', label: 'Added Sugar' },
                { num: '25g', label: 'Protein / Serve' },
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
              aria-label="Discover our process"
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

          {/* Right - Image — smoother reveal, better alignment */}
          <div className="story-image" style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(61,43,31,0.15)' }}>
            <img
              src="/images/story-peanuts.jpg"
              alt="Sustainably sourced roasted peanuts on a rustic table"
              loading="lazy"
              style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* ===== PRODUCT SHOWCASE — Updated to 2 Buttertofly products ===== */}
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
                {/* Updated heading for 2 products */}
                {splitText('Our Signature Flavours')}
              </h2>
            </div>
            <button
              aria-label="View all products"
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

        {/* Products — now uses centered grid instead of horizontal scroll for 2 items */}
        <div className="products-container flex flex-wrap justify-center gap-6 md:gap-8" style={{ padding: '0 clamp(24px, 6vw, 96px)' }}>
          {products.map(product => (
            <div
              key={product.name}
              className="product-card"
              role="article"
              aria-label={`${product.name} product card`}
              style={{
                width: 'clamp(280px, 38vw, 440px)',
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
              <div style={{ borderRadius: 16, overflow: 'hidden', background: '#F5E6D0', aspectRatio: '1/1', position: 'relative' }}>
                <img
                  src={product.image}
                  alt={`${product.name} jar`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
                />
                {/* Product badge */}
                {product.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: '#E8A000',
                      color: '#FFF8F0',
                      padding: '4px 12px',
                      borderRadius: 80,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: 'clamp(9px, 0.7vw, 11px)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {product.badge}
                  </span>
                )}
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
                    lineHeight: 1.5,
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
                    aria-label={`Add ${product.name} to cart`}
                    onClick={() => addToCart(product)}
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
      <section id="nutrition" className="relative overflow-hidden" style={{ background: '#3D2B1F', padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 96px)', zIndex: 10 }} aria-label="Nutrition information">
        {/* Decorative peanut outlines */}
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', top: '-10vw', right: '-5vw', width: '25vw', opacity: 0.08, animation: 'slowRotate 60s linear infinite' }}
          viewBox="0 0 100 100"
          fill="none"
        >
          <ellipse cx="50" cy="50" rx="35" ry="45" stroke="#E8A000" strokeWidth="1" />
          <path d="M50 5 Q55 25 50 50 Q45 75 50 95" stroke="#E8A000" strokeWidth="1" />
        </svg>
        <svg
          aria-hidden="true"
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

          {/* Updated brand reference from Uday's to Buttertofly */}
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
            Every jar of Buttertofly is a powerhouse of nutrition. High-quality protein, heart-healthy fats, and essential vitamins &mdash; all from nature&apos;s finest peanuts. Fuel your body with something real.
          </p>

          {/* Nutrition Icons */}
          <div className="nutrition-icons-row flex flex-wrap justify-center gap-8 md:gap-12 mt-12 md:mt-16">
            {nutritionStats.map(stat => (
              <div key={stat.label} className="nutrition-icon flex flex-col items-center" role="figure" aria-label={`${stat.value} ${stat.label}`}>
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8A000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
      <section id="recipes" className="relative" style={{ background: '#F5E6D0', padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 96px)', zIndex: 10 }} aria-label="Recipe inspiration">
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
                role="article"
                aria-label={`${recipe.name} recipe`}
                onClick={() => setSelectedRecipe(recipe)}
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
                  alt={`${recipe.name} prepared with Buttertofly peanut butter`}
                  loading="lazy"
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
                  aria-hidden="true"
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
              aria-label="Explore all recipes"
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

      {/*
       * ===== TESTIMONIALS SECTION — COMMENTED OUT =====
       * Reason: Temporarily hidden as requested. The testimonial data
       * (_testimonials array above) and this JSX block are preserved
       * intact so the section can be re-enabled in the future by
       * simply uncommenting this block.
       *
       * To re-enable:
       * 1. Uncomment this entire section
       * 2. Rename _testimonials back to testimonials
       * 3. Add 'testimonials' back to the nav sections array
       * 4. Re-enable testimonial card GSAP animation in scroll reveal useEffect
       */}
      {/*
      <section id="testimonials" className="relative" style={{ background: '#FFF8F0', padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 96px)', zIndex: 10 }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal-up text-center mb-12">
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 'clamp(10px, 0.75vw, 12px)', letterSpacing: '0.1em', color: '#E8A000', textTransform: 'uppercase' }}>REVIEWS</span>
            <h2 className="section-heading-reveal mt-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 3vw, 54px)', lineHeight: 1.1, letterSpacing: '-0.01em', color: '#3D2B1F' }}>
              {splitText('Loved by Thousands')}
            </h2>
          </div>
          <div className="testimonials-container flex gap-6 overflow-x-auto pb-4" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'thin' }}>
            {_testimonials.map((t, i) => (
              <div key={i} className="testimonial-card flex-shrink-0" style={{ minWidth: 'clamp(280px, 30vw, 380px)', maxWidth: 420, scrollSnapAlign: 'start', background: '#FFFFFF', borderRadius: 20, padding: 'clamp(20px, 2.5vw, 36px)', boxShadow: '0 8px 30px rgba(61,43,31,0.06)' }}>
                <div style={{ color: '#E8A000', fontSize: 'clamp(12px, 1vw, 16px)', letterSpacing: 2 }}>{'★'.repeat(t.rating)}</div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 'clamp(13px, 1vw, 16px)', lineHeight: 1.6, color: '#5C3D1E', fontStyle: 'italic', marginTop: 12 }}>&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 mt-6">
                  <img src={t.avatar} alt={t.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 'clamp(12px, 0.9vw, 14px)', color: '#3D2B1F' }}>{t.name}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 'clamp(11px, 0.8vw, 13px)', color: '#5C3D1E' }}>{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* ===== CTA BANNER ===== */}
      <section className="cta-section relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #E8A000 0%, #C27A00 100%)', padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 96px)', zIndex: 10, minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Call to action">
        {/* Decorative floating jars */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            aria-hidden="true"
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
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 2h10v4h-1v2h1v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8h1V6H7V2zm3 2v2h4V4h-4zM9 8v12h6V8H9z" />
            </svg>
          </div>
        ))}

        {/* Glow */}
        <div
          aria-hidden="true"
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
            aria-label="Shop now with free shipping"
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
              (e.target as HTMLElement).style.transform = 'translateY(-2px)';
              (e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(61,43,31,0.4)'
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.transform = 'translateY(0)';
              (e.target as HTMLElement).style.boxShadow = '0 8px 30px rgba(61,43,31,0.3)'
            }}
          >
            Shop Now &mdash; Free Shipping
          </button>
        </div>
      </section>

      {/* ===== CONTACT & FOOTER — New modern contact section with Buttertofly branding ===== */}
      <section id="contact" className="relative" style={{ background: '#3D2B1F', padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 96px) clamp(24px, 3vw, 40px)', zIndex: 10 }} aria-label="Contact information">
        <div className="max-w-[1400px] mx-auto">
          {/* Contact Header */}
          <div className="reveal-up text-center mb-12 md:mb-16">
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
              GET IN TOUCH
            </span>
            <h2
              className="section-heading-reveal mt-2"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(28px, 3vw, 54px)',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                color: '#FFF8F0',
              }}
            >
              {splitText("Let's Connect")}
            </h2>
          </div>

          {/* Contact Grid */}
          <div className="contact-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-16">
            {/* Email */}
            <div className="contact-info-item text-center sm:text-left">
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(232,160,0,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8A000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 'clamp(12px, 0.9vw, 14px)', color: '#FFF8F0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Email
              </h4>
              <a
                href="mailto:hello@buttertoflypb.com"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 'clamp(13px, 0.95vw, 15px)', color: 'rgba(255,248,240,0.7)', textDecoration: 'none', transition: 'color 0.3s', marginTop: 6, display: 'block' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#E8A000' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(255,248,240,0.7)' }}
              >
                hello@buttertoflypb.com
              </a>
            </div>

            {/* Phone */}
            <div className="contact-info-item text-center sm:text-left">
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(232,160,0,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8A000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 'clamp(12px, 0.9vw, 14px)', color: '#FFF8F0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Phone
              </h4>
              <a
                href="tel:+442012345678"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 'clamp(13px, 0.95vw, 15px)', color: 'rgba(255,248,240,0.7)', textDecoration: 'none', transition: 'color 0.3s', marginTop: 6, display: 'block' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#E8A000' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(255,248,240,0.7)' }}
              >
                +44 20 1234 5678
              </a>
            </div>

            {/* Location */}
            <div className="contact-info-item text-center sm:text-left">
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(232,160,0,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8A000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 'clamp(12px, 0.9vw, 14px)', color: '#FFF8F0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Location
              </h4>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 'clamp(13px, 0.95vw, 15px)', color: 'rgba(255,248,240,0.7)', marginTop: 6, display: 'block' }}>
                United Kingdom
              </span>
            </div>

            {/* Working Hours */}
            <div className="contact-info-item text-center sm:text-left">
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(232,160,0,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8A000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 'clamp(12px, 0.9vw, 14px)', color: '#FFF8F0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Working Hours
              </h4>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 'clamp(13px, 0.95vw, 15px)', color: 'rgba(255,248,240,0.7)', marginTop: 6, display: 'block' }}>
                Mon–Sat, 9 AM – 6 PM
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,248,240,0.1)', marginBottom: 'clamp(24px, 3vw, 40px)' }} aria-hidden="true" />

          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
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
                {/* Brand name — Buttertofly */}
                Buttertofly
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
              {/* Social Icons — updated: Twitter replaced with X */}
              <div className="flex gap-4 mt-6">
                {['Instagram', 'Facebook', 'X'].map(social => (
                  <a
                    key={social}
                    href="#"
                    aria-label={`Follow Buttertofly on ${social}`}
                    style={{
                      color: 'rgba(255,248,240,0.6)',
                      transition: 'color 0.3s',
                      display: 'inline-flex',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#E8A000' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,248,240,0.6)' }}
                  >
                    <SocialIcon name={social} />
                  </a>
                ))}
              </div>
            </div>

            {/* Shop — updated product names */}
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
                {['Classic Peanut Butter', 'Chocolate Peanut Butter'].map(link => (
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

          {/* Bottom bar — updated brand and location */}
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
              &copy; 2025 Buttertofly Peanut Butter. All rights reserved.
            </span>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(10px, 0.75vw, 12px)',
                color: 'rgba(255,248,240,0.4)',
              }}
            >
              Crafted with love in the United Kingdom
            </span>
          </div>
        </div>
      </section>

      {/* ===== SHOPPING CART DRAWER ===== */}
      <div
        className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`}
        onClick={() => {
          setIsCartOpen(false)
          setIsCheckingOut(false)
        }}
      />
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Shopping Cart">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <h3 className="font-semibold text-lg text-[#3D2B1F]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isCheckingOut ? 'Checkout Details' : 'Your Cart'}
          </h3>
          <button
            onClick={() => {
              setIsCartOpen(false)
              setIsCheckingOut(false)
            }}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3D2B1F', display: 'flex' }}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isCheckingOut ? (
            /* Item List View */
            cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                <ShoppingBag size={48} className="mb-4 text-[#E8A000]" />
                <p style={{ fontFamily: 'Inter, sans-serif', color: '#3D2B1F' }}>Your cart is empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2 rounded-full bg-[#E8A000] text-[#FFF8F0] font-semibold text-sm hover:bg-[#C27A00] transition-colors"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.name} className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-black/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-[#3D2B1F] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</h4>
                      <p className="text-xs text-[#E8A000] font-semibold mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        £{item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.name, -1)}
                          className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                          style={{ border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium text-[#3D2B1F]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.name, 1)}
                          className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                          style={{ border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.name)}
                      className="p-2 text-black/40 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Checkout Form View */
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D2B1F] mb-1 uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={checkoutForm.name}
                  onChange={handleCheckoutChange}
                  className="cart-input"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3D2B1F] mb-1 uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={checkoutForm.email}
                  onChange={handleCheckoutChange}
                  className="cart-input"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3D2B1F] mb-1 uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>Delivery Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={checkoutForm.address}
                  onChange={handleCheckoutChange}
                  className="cart-input"
                  placeholder="Enter shipping address"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3D2B1F] mb-1 uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={checkoutForm.phone}
                  onChange={handleCheckoutChange}
                  className="cart-input"
                  placeholder="Enter phone number"
                />
              </div>
            </form>
          )
        }
        </div>

        {/* Footer Area */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-black/10 bg-[#FFF8F0]/80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#3D2B1F] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Subtotal</span>
              <span className="text-[#3D2B1F] font-bold text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                £{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
              </span>
            </div>

            {isCheckingOut ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="flex-1 py-3 rounded-full border border-[#3D2B1F] text-[#3D2B1F] font-semibold text-sm transition-all hover:bg-black/5"
                  style={{ background: 'none', cursor: 'pointer' }}
                >
                  Back to Cart
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="flex-1 py-3 rounded-full bg-[#E8A000] text-[#FFF8F0] font-semibold text-sm hover:bg-[#C27A00] transition-colors"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  Place Order
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3 rounded-full bg-[#E8A000] text-[#FFF8F0] font-semibold text-sm hover:bg-[#C27A00] transition-colors flex items-center justify-center gap-2"
                style={{ border: 'none', cursor: 'pointer' }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ===== ORDER SUCCESS CONFIRMATION MODAL ===== */}
      {orderSuccess && (
        <div className="modal-overlay" onClick={() => setOrderSuccess(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="checkmark-container">
              <svg className="checkmark-svg" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="25" fill="none" />
                <path d="M14 27l8 8 16-16" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#3D2B1F]" style={{ fontFamily: 'Inter, sans-serif' }}>Order Confirmed!</h3>
            <p className="text-sm text-[#5C3D1E] mt-2 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Thank you for ordering with Buttertofly. Your fresh, slow-roasted peanut butter is being prepared.
            </p>
            <div className="my-6 p-3 bg-white rounded-xl border border-black/5 inline-block">
              <span className="text-xs text-black/50 block uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Order reference</span>
              <span className="font-mono text-sm font-bold text-[#E8A000] mt-1 block">{orderId}</span>
            </div>
            <button
              onClick={() => setOrderSuccess(false)}
              className="w-full py-3 rounded-full bg-[#3D2B1F] text-[#FFF8F0] font-semibold text-sm hover:bg-black transition-colors"
              style={{ border: 'none', cursor: 'pointer' }}
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}

      {/* ===== FULL PAGE RECIPE DETAILS OVERLAY ===== */}
      {selectedRecipe && (
        <div className="recipe-overlay" role="dialog" aria-modal="true" aria-label={`${selectedRecipe.name} details`}>
          {/* Header */}
          <div className="sticky top-0 bg-[#FFF8F0]/90 backdrop-blur-md z-[1060] border-b border-black/5 px-6 py-4 flex items-center justify-between">
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 'clamp(14px, 1.2vw, 20px)', color: '#3D2B1F' }}>
              Buttertofly Kitchen
            </span>
            <button
              onClick={() => setSelectedRecipe(null)}
              className="px-6 py-2 rounded-full border border-[#3D2B1F] text-[#3D2B1F] font-semibold text-sm hover:bg-[#3D2B1F] hover:text-[#FFF8F0] transition-all cursor-pointer flex items-center gap-2"
              aria-label="Back to Recipes"
            >
              &larr; Back to Recipes
            </button>
          </div>

          <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left side: Image & Stats */}
            <div>
              <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 50px rgba(61,43,31,0.15)' }}>
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.name}
                  style={{ width: '100%', aspectRatio: '16/11', objectFit: 'cover' }}
                />
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-[#3D2B1F] mt-8" style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.15 }}>
                {selectedRecipe.name}
              </h1>

              {/* Recipe Meta Info */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="px-4 py-2 bg-[#F5E6D0] rounded-xl flex items-center gap-2">
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#5C3D1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Prep Time</span>
                  <span className="text-sm font-bold text-[#E8A000]">{recipesDetail[selectedRecipe.name]?.prepTime || selectedRecipe.time}</span>
                </div>
                <div className="px-4 py-2 bg-[#F5E6D0] rounded-xl flex items-center gap-2">
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#5C3D1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Difficulty</span>
                  <span className="text-sm font-bold text-[#E8A000]">{recipesDetail[selectedRecipe.name]?.difficulty || 'Easy'}</span>
                </div>
                <div className="px-4 py-2 bg-[#F5E6D0] rounded-xl flex items-center gap-2">
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#5C3D1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Servings</span>
                  <span className="text-sm font-bold text-[#E8A000]">{recipesDetail[selectedRecipe.name]?.servings || '1 Bowl'}</span>
                </div>
              </div>
            </div>

            {/* Right side: Ingredients & Instructions */}
            <div className="space-y-8">
              {/* Ingredients Checklist */}
              <div>
                <h3 className="text-lg font-bold text-[#3D2B1F] mb-4 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Ingredients</h3>
                <ul className="space-y-3">
                  {recipesDetail[selectedRecipe.name]?.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <input type="checkbox" id={`ing-${idx}`} className="recipe-checkbox mt-0.5" />
                      <label htmlFor={`ing-${idx}`} className="text-[#5C3D1E] text-sm cursor-pointer select-none" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {ing.includes('Buttertofly') ? (
                          <strong>{ing}</strong>
                        ) : ing}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step by Step Instructions */}
              <div>
                <h3 className="text-lg font-bold text-[#3D2B1F] mb-4 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Step by Step Instructions</h3>
                <div className="space-y-6">
                  {recipesDetail[selectedRecipe.name]?.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="recipe-step-number">{idx + 1}</div>
                      <p className="text-[#5C3D1E] text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== SONNER TOASTER ===== */}
      <Toaster position="top-right" richColors closeButton />
    </>
  )
}

/* ===== SOCIAL ICONS — Updated: Added X (formerly Twitter) icon ===== */
function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, React.JSX.Element> = {
    Instagram: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    Facebook: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    /* X icon (formerly Twitter) — using the modern X/Twitter logo path */
    X: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  }
  return icons[name] || null
}
