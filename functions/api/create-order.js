export async function onRequestPost({ request }) {
  try {
    const orderData = await request.json();
    
    // 가상 주문 처리 로직
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    return new Response(JSON.stringify({ 
      success: true, 
      orderId,
      message: "주문이 성공적으로 접수되었습니다." 
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: "주문 처리 중 오류가 발생했습니다." 
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
