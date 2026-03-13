import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Instagram, Phone, Clock, MapPin, ArrowRight } from 'lucide-react'
import './App.css'

function App() {
  const products = [
    {
      id: 1,
      title: "Birthday Cake",
      description: "Perfect for a special day",
      price: "50,000 KRW",
      status: "ORDER AVAILABLE",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "Wedding Cake",
      description: "Recording the brightest moment",
      price: "150,000 KRW",
      status: "PRE-ORDER ONLY",
      image: "https://images.unsplash.com/photo-1535254973040-607b474cb8c2?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      title: "Dessert Set",
      description: "Sweetness for your loved ones",
      price: "30,000 KRW",
      status: "ORDER AVAILABLE",
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=60"
    }
  ]

  return (
    <div className="App">
      <header>
        <div className="logo serif">Minji Cake</div>
        <nav>
          <a href="#collections">Collections</a>
          <a href="#guide">Order Guide</a>
          <a href="#reviews">Reviews</a>
          <a href="https://instagram.com/minji_cake" target="_blank">Contact</a>
        </nav>
      </header>

      <main>
        {/* HERO SECTION - Premium Look */}
        <section className="hero">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-label"
          >
            EST. 2026 / HAPJEONG
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Baking Your<br/>Special Moments
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <a href="#collections" className="cta">ORDER NOW</a>
          </motion.div>
        </section>

        {/* PRODUCT GRID - Ecommerce Style */}
        <section id="collections" style={{ padding: '8rem 0' }}>
          <div className="section-title">
            <p className="serif" style={{ color: '#C5A059', letterSpacing: '2px', marginBottom: '1rem' }}>COLLECTIONS</p>
            <h2>The Art of Cake</h2>
          </div>
          
          <div className="product-grid">
            {products.map((item) => (
              <motion.div 
                key={item.id}
                className="product-card"
                whileHover={{ y: -10 }}
              >
                <div className="product-image-wrapper">
                  <div className="status-tag">{item.status}</div>
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="product-info">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="price">{item.price}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ORDER GUIDE - Pain Point Solution */}
        <section id="guide" className="order-guide-container">
          <div className="section-title">
            <p className="serif" style={{ color: '#C5A059', letterSpacing: '2px', marginBottom: '1rem' }}>HOW TO ORDER</p>
            <h2>Your Journey to Sweetness</h2>
            <p style={{ marginTop: '1rem' }}>3 WEEKS ADVANCE BOOKING IS HIGHLY RECOMMENDED</p>
          </div>

          <div className="guide-steps">
            <div className="step-item">
              <span className="step-number">01</span>
              <h4>Choose Design</h4>
              <p>기존 디자인 선택 또는 <br/>커스텀 시안을 준비해주세요.</p>
            </div>
            <div className="step-item">
              <span className="step-number">02</span>
              <h4>Consultation</h4>
              <p>인스타그램 DM을 통해 <br/>상세 예약 가능 여부를 확인하세요.</p>
            </div>
            <div className="step-item">
              <span className="step-number">03</span>
              <h4>Confirmation</h4>
              <p>결제 및 최종 픽업 <br/>시간을 확정합니다.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <div style={{ padding: '2rem', border: '1px solid #C5A059', display: 'inline-block', borderRadius: '4px' }}>
              <p className="serif" style={{ fontSize: '1.2rem' }}>"매일 아침 합정 공방에서 정성껏 구워냅니다."</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <h2 className="serif">Minji Cake</h2>
          <p>The one and only handmade cake in the world.</p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <Instagram size={20} />
            <Phone size={20} />
          </div>
        </div>

        <div className="footer-info">
          <h5>Location & Hours</h5>
          <p><MapPin size={14} inline /> 합정역 7번 출구 도보 5분</p>
          <p><Clock size={14} inline /> 화-일 10:00 - 19:00</p>
          <p style={{ color: '#C5A059' }}>매주 월요일 정기 휴무</p>
        </div>

        <div className="footer-info">
          <h5>Booking Policy</h5>
          <p>최소 3일 전 예약 필수</p>
          <p>기념일 시즌 3주 전 예약 권장</p>
          <p>당일 픽업 문의 불가</p>
        </div>
      </footer>
    </div>
  )
}

export default App
