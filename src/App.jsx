import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Instagram, Phone, Clock, MapPin, Star, Quote } from 'lucide-react'
import './App.css'

function App() {
  const products = [
    {
      id: 1,
      title: "시그니처 레터링 케이크",
      description: "특별한 날, 소중한 마음을 담은 디자인",
      price: "50,000원 ~",
      status: "예약 가능",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "럭셔리 웨딩 케이크",
      description: "인생의 가장 빛나는 순간을 기록하다",
      price: "150,000원 ~",
      status: "최소 3주 전 예약",
      image: "https://images.unsplash.com/photo-1535254973040-607b474cb8c2?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      title: "프리미엄 디저트 세트",
      description: "사랑하는 사람을 위한 달콤한 선물",
      price: "30,000원 ~",
      status: "예약 가능",
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=60"
    }
  ]

  const reviews = [
    {
      id: 1,
      user: "김*아 님",
      rating: 5,
      content: "부모님 환갑 케이크로 주문했는데 너무 디자인이 고급스럽고 맛도 훌륭해요! 백화점 퀄리티 그 이상입니다.",
      date: "2024.03.11"
    },
    {
      id: 2,
      user: "이*준 님",
      rating: 5,
      content: "웨딩 촬영용으로 주문했는데 사진 너무 잘 나왔어요. 세심하게 상담해주셔서 감사합니다!",
      date: "2024.03.05"
    },
    {
      id: 3,
      user: "최*서 님",
      rating: 5,
      content: "디자인이 정말 예술이에요. 합정 근처 케이크 중 단연 최고인 것 같습니다.",
      date: "2024.02.28"
    }
  ]

  return (
    <div className="App">
      <header>
        <div className="logo serif">Minji Cake</div>
        <nav>
          <a href="#collections">컬렉션</a>
          <a href="#guide">주문 가이드</a>
          <a href="#reviews">고객 후기</a>
          <a href="#boutique">부티크</a>
          <a href="https://instagram.com/minji_cake" target="_blank">상담하기</a>
        </nav>
      </header>

      <main>
        {/* HERO SECTION - Premium Look with Korean */}
        <section className="hero">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hero-overlay"
          />
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-label"
          >
            SINCE 2026 / HAPJEONG BOUTIQUE
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            당신의 특별한 순간을<br/>가장 달콤하게 기록합니다
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <a href="#collections" className="cta">주문하기</a>
          </motion.div>
        </section>

        {/* BOUTIQUE PHOTO SECTION - New! */}
        <section id="boutique" className="boutique-showcase">
          <div className="section-title">
            <p className="serif" style={{ color: '#C5A059', letterSpacing: '2px', marginBottom: '1rem' }}>OUR BOUTIQUE</p>
            <h2>민지케이크 합정 부티크</h2>
            <p>백화점의 품격과 수제 공방의 온기가 만나는 공간입니다.</p>
          </div>
          <div className="boutique-image-container">
            <img src="/boutique.png" alt="민지케이크 럭셔리 매장" className="boutique-main-img" />
          </div>
        </section>

        {/* PRODUCT GRID - Optimized Korean */}
        <section id="collections" style={{ padding: '8rem 0' }}>
          <div className="section-title">
            <p className="serif" style={{ color: '#C5A059', letterSpacing: '2px', marginBottom: '1rem' }}>SIGNATURE COLLECTIONS</p>
            <h2>작품으로 빚어낸 케이크</h2>
            <p>모든 케이크는 숙련된 파티시에의 손길로 정성껏 탄생합니다.</p>
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

        {/* REVIEWS SECTION - Enhanced! */}
        <section id="reviews" className="reviews-section">
          <div className="section-title">
            <p className="serif" style={{ color: '#C5A059', letterSpacing: '2px', marginBottom: '1rem' }}>REVIEWS</p>
            <h2>따뜻한 이야기</h2>
          </div>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <motion.div 
                key={review.id}
                className="review-card-v3"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <Quote size={32} color="#C5A059" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p className="review-content">"{review.content}"</p>
                <div className="review-meta">
                  <div className="stars">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#C5A059" color="#C5A059" />
                    ))}
                  </div>
                  <span className="user-name">{review.user}</span>
                  <span className="review-date">{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ORDER GUIDE - Localized & Visual */}
        <section id="guide" className="order-guide-container">
          <div className="section-title">
            <p className="serif" style={{ color: '#C5A059', letterSpacing: '2px', marginBottom: '1rem' }}>ORDER GUIDE</p>
            <h2>간편한 예약 안내</h2>
            <p style={{ marginTop: '1rem', color: '#e8305e', fontWeight: '600' }}>⚠️ 모든 케이크는 예약제로만 운영되며, 최소 3일~3주 전 예약을 권장드립니다.</p>
          </div>

          <div className="guide-steps">
            <div className="step-item">
              <span className="step-number">01</span>
              <h4>디자인 상담</h4>
              <p>인스타그램 DM 또는 전화 상담을 통해<br/>원하시는 디자인과 날짜를 확인합니다.</p>
            </div>
            <div className="step-item">
              <span className="step-number">02</span>
              <h4>주문서 작성</h4>
              <p>상담 완료 후 전달드리는<br/>상세 주문서를 작성해주세요.</p>
            </div>
            <div className="step-item">
              <span className="step-number">03</span>
              <h4>방문 픽업</h4>
              <p>정해진 시간에 합정역 인근<br/>부티크를 방문하여 수령하세요.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <h2 className="serif">Minji Cake</h2>
          <p>세상에 하나뿐인 수제 케이크, 민지케이크.</p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <Instagram size={20} />
            <Phone size={20} />
          </div>
        </div>

        <div className="footer-info">
          <h5>위치 및 운영 시간</h5>
          <p><MapPin size={14} inline style={{marginRight: '8px'}} /> 합정역 7번 출구 도보 5분</p>
          <p><Clock size={14} inline style={{marginRight: '8px'}} /> 화-일 10:00 - 19:00</p>
          <p style={{ color: '#C5A059', marginTop: '4px' }}>매주 월요일 정기 휴무</p>
        </div>

        <div className="footer-info">
          <h5>예약 정책</h5>
          <p>최소 3일 전 예약 필수</p>
          <p>시즌 케이크 3주 전 권장</p>
          <p>당일 픽업/예약 불가</p>
        </div>
      </footer>
    </div>
  )
}

export default App
