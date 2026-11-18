var KOREAN_FOODS = [
  { name: '김치찌개', cd: 'kimchi_stew' },
  { name: '비빔밥', cd: 'bibimbap' },
  { name: '불고기', cd: 'bulgogi' },
  { name: '된장찌개', cd: 'doenjang_stew' },
  { name: '잡채', cd: 'japchae' },
];

var AMERICAN_FOODS = [
  { name: '햄버거', cd: 'hamburger' },
  { name: '핫도그', cd: 'hotdog' },
  { name: '바비큐 립', cd: 'bbq_ribs' },
  { name: '클램 차우더', cd: 'clam_chowder' },
  { name: '치킨 윙', cd: 'chicken_wings' },
];

var CHINESE_FOODS = [
  { name: '짜장면', cd: 'zhajiangmian' },
  { name: '탕수육', cd: 'tangsuyuk' },
  { name: '마파두부', cd: 'mapo_tofu' },
  { name: '양장피', cd: 'yangjangpi' },
  { name: '깐풍기', cd: 'kanpunggi' },
];

var JAPANESE_FOODS = [
  { name: '스시', cd: 'sushi', disabled: true },
  { name: '라멘', cd: 'ramen' },
  { name: '돈카츠', cd: 'tonkatsu' },
  { name: '우동', cd: 'udon' },
  { name: '오코노미야키', cd: 'okonomiyaki' },
];

var ALL_FOODS = [...KOREAN_FOODS, ...AMERICAN_FOODS, ...CHINESE_FOODS, ...JAPANESE_FOODS];
