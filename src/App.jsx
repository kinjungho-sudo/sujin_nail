import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Instagram, Phone, Clock, MapPin, Star, Quote, X, CheckCircle } from 'lucide-react'
import './App.css'

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isOrdering, setIsOrdering] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const products = [
    { id: 1, title: "시그니처 레터링 케이크", price: "55,000원", status: "예약가능", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop" },
    { id: 2, title: "럭셔리 로즈 웨딩", price: "180,000원", status: "3주전예약", image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&auto=format&fit=crop" },
    { id: 3, title: "레드벨벳 하트", price: "48,000원", status: "인기상품", image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&auto=format&fit=crop" },
    { id: 4, title: "스노우 순백 생크림", price: "45,000원", status: "베스트", image: "https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=800&auto=format&fit=crop" },
    { id: 5, title: "벨기에 가나슈 초코", price: "52,000원", status: "예약가능", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop" },
    { id: 6, title: "얼그레이 클래식", price: "49,000원", status: "추천", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop" },
    { id: 7, title: "제주 말차 포레스트", price: "50,000원", status: "예약가능", image: "https://images.unsplash.com/photo-1515276427842-f85802d514a2?w=800&auto=format&fit=crop" },
    { id: 8, title: "블루베리 멜로우", price: "53,000원", status: "인기", image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&auto=format&fit=crop" },
    { id: 9, title: "샤인머스캣 파라다이스", price: "65,000원", status: "시즌한정", image: "https://images.unsplash.com/photo-1602351447937-745cb720612f?w=800&auto=format&fit=crop" },
    { id: 10, title: "이탈리안 티라미수", price: "47,000원", status: "예약가능", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop" },
    { id: 11, title: "당근 케이크 가든", price: "46,000원", status: "예약가능", image: "https://images.unsplash.com/photo-1622921441337-c663e62e15e6?w=800&auto=format&fit=crop" },
    { id: 12, title: "프리미엄 기프트 세트", price: "35,000원", status: "선물추천", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop" }
  ]

  const handleOrder = (product) => {
    setSelectedProduct(product)
    setIsOrdering(true)
  }

  const proceedToPay = (e) => {
    e.preventDefault()
    setIsPaying(true)
    // 가상 결제 시뮬레이션
    setTimeout(() => {
      setIsPaying(false)
      setIsOrdering(false)
      setPaymentSuccess(true)
    }, 2000)
  }

  return (
    <div className="App">
      <header>
        <div className="logo serif">Minji Cake</div>
        <nav>
          <a href="#collections">제품보기</a>
          <a href="#guide">주문안내</a>
          <a href="#boutique">부티크</a>
          <a href="https://instagram.com/minji_cake" target="_blank">상담</a>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hero-label">
            PREMIUM HANDMADE CAKE
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            달콤한 기록의 시작,<br/>민지케이크
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <a href="#collections" className="cta">주문 바로가기</a>
          </motion.div>
        </section>

        {/* BOUTIQUE */}
        <section id="boutique" className="boutique-showcase">
          <div className="section-title">
            <p className="serif" style={{ color: '#C5A059', letterSpacing: '2px', marginBottom: '1rem' }}>BOUTIQUE</p>
            <h2>합정 부티크의 품격</h2>
            <p>백화점의 감성을 담은 민지케이크의 가상 쇼룸입니다.</p>
          </div>
          <div className="boutique-image-container">
            <img src="/boutique.png" alt="Boutique" className="boutique-main-img" />
          </div>
        </section>

        {/* COLLECTIONS - 12 Items */}
        <section id="collections" style={{ padding: '8rem 0' }}>
          <div className="section-title">
            <p className="serif" style={{ color: '#C5A059', letterSpacing: '2px', marginBottom: '1rem' }}>COLLECTIONS</p>
            <h2>다채로운 선율의 케이크</h2>
            <p>뚜레쥬르처럼 풍성한 라인업을 민지케이크만의 감성으로 만나보세요.</p>
          </div>
          
          <div className="product-grid">
            {products.map((item) => (
              <motion.div key={item.id} className="product-card" whileHover={{ y: -10 }} onClick={() => handleOrder(item)}>
                <div className="product-image-wrapper">
                  <div className="status-tag">{item.status}</div>
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="product-info">
                  <h3>{item.title}</h3>
                  <div className="price">{item.price}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ORDER GUIDE */}
        <section id="guide" className="order-guide-container">
          <div className="section-title">
            <p className="serif" style={{ color: '#C5A059', letterSpacing: '2px', marginBottom: '1rem' }}>GUIDE</p>
            <h2>주문 및 결제 안내</h2>
            <p style={{ color: '#e8305e', fontWeight: 600 }}>모든 제품은 픽업 전 결제가 필수입니다.</p>
          </div>
          <div className="guide-steps">
            <div className="step-item">
              <span className="step-number">01</span>
              <h4>상품 선택</h4>
              <p>원하는 디자인을 클릭하여 주문을 시작하세요.</p>
            </div>
            <div className="step-item">
              <span className="step-number">02</span>
              <h4>픽업 예약</h4>
              <p>날짜와 시간을 선택하고 결제를 진행합니다.</p>
            </div>
            <div className="step-item">
              <span className="step-number">03</span>
              <h4>달콤한 수령</h4>
              <p>합정 부티크에서 정성껏 준비된 케이크를 만나세요.</p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">
          <h2 className="serif">Minji Cake</h2>
          <p>The premium art of handmade cakes.</p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <Instagram size={20} />
            <Phone size={20} />
          </div>
        </div>
        <div className="footer-info">
          <h5>부티크 위치</h5>
          <p><MapPin size={14} inline style={{marginRight: '8px'}} /> 합정역 7번 출구 5분 거리</p>
          <p><Clock size={14} inline style={{marginRight: '8px'}} /> 화-일 10:00 - 19:00 (월 휴무)</p>
        </div>
      </footer>

      {/* ORDER MODAL */}
      <AnimatePresence>
        {isOrdering && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <X className="close-modal" onClick={() => setIsOrdering(false)} />
              <h2 className="serif">주문 예약</h2>
              <div style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <img src={selectedProduct.image} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '1.2rem' }}>{selectedProduct.title}</h4>
                  <p style={{ color: '#C5A059', fontWeight: 700 }}>{selectedProduct.price}</p>
                </div>
              </div>
              
              <form className="order-form" onSubmit={proceedToPay}>
                <label>예약자 성함</label>
                <input type="text" placeholder="성함을 입력해주세요" required />
                <label>연락처</label>
                <input type="tel" placeholder="010-0000-0000" required />
                <label>픽업 희망일</label>
                <input type="date" required />
                
                <button type="submit" className="pay-btn" disabled={isPaying}>
                  {isPaying ? "결제 처리 중..." : `${selectedProduct.price} 결제하기`}
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#999', marginTop: '1rem' }}>
                  안전한 토스페이먼츠 가상 결제 시스템으로 연결됩니다.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="modal-content" style={{ textAlign: 'center' }}>
              <CheckCircle size={60} color="#3182f6" style={{ marginBottom: '2rem' }} />
              <h2 className="serif">결제 완료</h2>
              <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                예약이 성공적으로 확정되었습니다!<br/>정성껏 준비하여 픽업일에 뵙겠습니다.
              </p>
              <button className="pay-btn" onClick={() => setPaymentSuccess(false)}>홈으로 돌아가기</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
