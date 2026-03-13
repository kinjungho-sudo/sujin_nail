import React from 'react'
import './App.css'

function App() {
  return (
    <div className="App">
      <header>
        <div className="logo">🍰 민지케이크</div>
        <nav>
          <a href="https://instagram.com/minji_cake" target="_blank" className="cta-button">상담하기</a>
        </nav>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <span style={{color: 'var(--accent-gold)', fontWeight: '600', letterSpacing: '2px'}}>PREMIUM HANDMADE</span>
          <h1>인생의 가장 달콤한 기록,<br/>민지케이크</h1>
          <p>합정의 작은 공방에서 피어나는 따뜻한 수제 감성 이야기.</p>
          <img 
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=60" 
            alt="수제 케이크" 
            style={{width: '100%', maxWidth: '600px', borderRadius: '20px', marginBottom: '2rem'}}
          />
        </section>

        {/* SERVICES */}
        <section id="services">
          <h2>우리의 서비스</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>🎈 생일 케이크</h3>
              <p>소중한 사람의 생일을 더욱 특별하게 만듭니다.</p>
              <p className="price">50,000원 ~</p>
            </div>
            <div className="service-card">
              <h3>💍 웨딩 케이크</h3>
              <p>가장 빛나는 날을 위한 우아한 디자인.</p>
              <p className="price">150,000원 ~</p>
            </div>
            <div className="service-card">
              <h3>🍪 디저트 세트</h3>
              <p>부담없이 즐기는 정성 가득한 세트.</p>
              <p className="price">30,000원 ~</p>
            </div>
          </div>
        </section>

        {/* ORDER GUIDE - Solution for user's pain point */}
        <section id="guide">
          <div className="order-guide">
            <h2 style={{color: '#e8305e'}}>"가격이요? 기간이요?" 👋</h2>
            <p style={{textAlign: 'center', marginBottom: '2rem'}}>매일 같은 질문에 답하는 번거로움을 줄여드릴게요!</p>
            
            <div className="guide-item">
              <strong>📍 가격 안내</strong>
              <p>기본 가격 외 디자인 난이도에 따라 추가 비용이 발생할 수 있습니다.</p>
            </div>
            <div className="guide-item">
              <strong>📅 제작 기간</strong>
              <p>모든 케이크는 수제 제작되므로 최소 3일 전 예약을 권장 드립니다.</p>
            </div>
            <div className="guide-item">
              <strong>🏠 픽업 위치</strong>
              <p>합정역 7번 출구 도보 5분 거리 (화-일 10:00~19:00 / 월요일 휴무)</p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="reviews">
          <h2>따뜻한 후기</h2>
          <div className="review-card">
            <p>"디자인이 너무 예뻐서 먹기 아까웠어요! 합정역에서 찾아가기 쉽네요." - @cake_lover</p>
          </div>
          <div className="review-card">
            <p>"웨딩 케이크 덕분에 파티 분위기가 확 살았어요. 정말 감사합니다!" - @sh_lee</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="contact-info">
          <p>📸 Instagram @minji_cake</p>
          <p>📞 010-XXXX-XXXX</p>
          <p>© 2026 민지케이크. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
