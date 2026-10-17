// 실제 개인정보가 아닌 업무 화면 검증용 가상 상품·거래 데이터다.
var BUSINESS_PRODUCTS = [
  '콜롬비아 원두 1kg',
  '제주 유기농 녹차',
  '생수 500mL',
  '통밀 식빵',
  '국산 사과 3kg',
  '코튼 타월 세트',
];
var BUSINESS_CUSTOMERS = ['한빛유통', '새봄마켓', '동해리테일', '온누리상사', '푸른식품', '다온스토어'];
var BUSINESS_REGIONS = ['서울', '부산', '대구', '인천', '광주', '대전'];
var BUSINESS_STATUSES = ['주문 접수', '출고 준비', '배송 중', '배송 완료'];
function businessProduct(index) {
  return BUSINESS_PRODUCTS[index % BUSINESS_PRODUCTS.length];
}
function businessOrder(index) {
  return `SO-202610-${String(index + 1).padStart(6, '0')}`;
}
function businessCustomer(index) {
  return BUSINESS_CUSTOMERS[index % BUSINESS_CUSTOMERS.length];
}
function businessRegion(index) {
  return BUSINESS_REGIONS[index % BUSINESS_REGIONS.length];
}
function businessStatus(index) {
  return BUSINESS_STATUSES[index % BUSINESS_STATUSES.length];
}
function businessNote(index) {
  return ['매장 정기 발주', '오전 입고 요청', '냉장 배송 요청', '신규 거래처 초도 발주'][index % 4];
}
