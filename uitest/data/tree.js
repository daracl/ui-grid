var G_TREE_CHILD_DATA = [
  {
    id: '1-1',
    pid: '1',
    name: '인사부',
    children: [
      {
        id: '1-1-1',
        pid: '1-1',
        name: '인사팀',
        children: [
          {
            id: '1-1-1-1',
            pid: '1-1-1',
            name: '김철수',
            position: '팀장',
            age: 38,
            email: 'chulsoo.kim@company.com',
          },
          {
            id: '1-1-1-2',
            pid: '1-1-1',
            name: '박영희',
            position: '팀원',
            age: 29,
            email: 'younghee.park@company.com',
          },
          { id: '1-1-1-3', pid: '1-1-1', name: '최민호', position: '팀원', age: 31, email: 'minho.choi@company.com' },
          { id: '1-1-1-4', pid: '1-1-1', name: '이수진', position: '팀원', age: 28, email: 'sujin.lee@company.com' },
        ],
      },
      {
        id: '1-1-2',
        pid: '1-1',
        name: '채용팀',
        children: [
          {
            id: '1-1-2-1',
            pid: '1-1-2',
            name: '정민재',
            position: '팀장',
            age: 35,
            email: 'minjae.jung@company.com',
          },
          {
            id: '1-1-2-2',
            pid: '1-1-2',
            name: '강하늘',
            position: '팀원',
            age: 27,
            email: 'haneul.kang@company.com',
          },
          { id: '1-1-2-3', pid: '1-1-2', name: '송지훈', position: '팀원', age: 30, email: 'jihun.song@company.com' },
          {
            id: '1-1-2-4',
            pid: '1-1-2',
            name: '윤서영',
            position: '팀원',
            age: 29,
            email: 'seoyoung.yoon@company.com',
          },
        ],
      },
    ],
  },
  {
    id: '1-2',
    pid: '1',
    name: '개발부',
    children: [
      {
        id: '1-2-1',
        pid: '1-2',
        name: '프론트엔드팀',
        children: [
          { id: '1-2-1-1', pid: '1-2-1', name: '이민수', position: '팀장', age: 37, email: 'minsoo.lee@company.com' },
          { id: '1-2-1-2', pid: '1-2-1', name: '최수진', position: '팀원', age: 30, email: 'sujin.choi@company.com' },
          { id: '1-2-1-3', pid: '1-2-1', name: '한지훈', position: '팀원', age: 28, email: 'jihun.han@company.com' },
          { id: '1-2-1-4', pid: '1-2-1', name: '박예진', position: '팀원', age: 29, email: 'yejin.park@company.com' },
        ],
      },
      {
        id: '1-2-2',
        pid: '1-2',
        name: '백엔드팀',
        children: [
          {
            id: '1-2-2-1',
            pid: '1-2-2',
            name: '정우성',
            position: '팀장',
            age: 40,
            email: 'woosung.jung@company.com',
          },
          { id: '1-2-2-2', pid: '1-2-2', name: '한지민', position: '팀원', age: 32, email: 'jimin.han@company.com' },
          { id: '1-2-2-3', pid: '1-2-2', name: '오세훈', position: '팀원', age: 29, email: 'sehun.oh@company.com' },
          {
            id: '1-2-2-4',
            pid: '1-2-2',
            name: '김서연',
            position: '팀원',
            age: 31,
            email: 'seoyeon.kim@company.com',
          },
        ],
      },
    ],
  },
  {
    id: '1-3',
    pid: '1',
    name: '마케팅부',
    children: [
      {
        id: '1-3-1',
        pid: '1-3',
        name: '브랜드팀',
        children: [
          {
            id: '1-3-1-1',
            pid: '1-3-1',
            name: '김나영',
            position: '팀장',
            age: 36,
            email: 'nayoung.kim@company.com',
          },
          {
            id: '1-3-1-2',
            pid: '1-3-1',
            name: '박서준',
            position: '팀원',
            age: 29,
            email: 'seojoon.park@company.com',
          },
          { id: '1-3-1-3', pid: '1-3-1', name: '이하늘', position: '팀원', age: 28, email: 'haneul.lee@company.com' },
        ],
      },
      {
        id: '1-3-2',
        pid: '1-3',
        name: '콘텐츠팀',
        children: [
          { id: '1-3-2-1', pid: '1-3-2', name: '정다은', position: '팀장', age: 34, email: 'daeun.jung@company.com' },
          { id: '1-3-2-2', pid: '1-3-2', name: '송유진', position: '팀원', age: 27, email: 'yujin.song@company.com' },
          { id: '1-3-2-3', pid: '1-3-2', name: '오민재', position: '팀원', age: 30, email: 'minjae.oh@company.com' },
        ],
      },
    ],
  },
  {
    id: '1-4',
    pid: '1',
    name: '영업부',
    children: [
      {
        id: '1-4-1',
        pid: '1-4',
        name: '국내영업팀',
        children: [
          {
            id: '1-4-1-1',
            pid: '1-4-1',
            name: '강민혁',
            position: '팀장',
            age: 39,
            email: 'minhyuk.kang@company.com',
          },
          { id: '1-4-1-2', pid: '1-4-1', name: '유지훈', position: '팀원', age: 31, email: 'jihun.yoo@company.com' },
          { id: '1-4-1-3', pid: '1-4-1', name: '김소연', position: '팀원', age: 28, email: 'soyeon.kim@company.com' },
        ],
      },
      {
        id: '1-4-2',
        pid: '1-4',
        name: '해외영업팀',
        children: [
          {
            id: '1-4-2-1',
            pid: '1-4-2',
            name: '박현수',
            position: '팀장',
            age: 40,
            email: 'hyunsu.park@company.com',
          },
          { id: '1-4-2-2', pid: '1-4-2', name: '이예진', position: '팀원', age: 29, email: 'yejin.lee@company.com' },
          { id: '1-4-2-3', pid: '1-4-2', name: '최민기', position: '팀원', age: 30, email: 'minki.choi@company.com' },
        ],
      },
    ],
  },
  {
    id: '1-5',
    pid: '1',
    name: '재무부',
    children: [
      {
        id: '1-5-1',
        pid: '1-5',
        name: '회계팀',
        children: [
          {
            id: '1-5-1-1',
            pid: '1-5-1',
            name: '홍길동',
            position: '팀장',
            age: 41,
            email: 'gildong.hong@company.com',
          },
          {
            id: '1-5-1-2',
            pid: '1-5-1',
            name: '유민정',
            position: '팀원',
            age: 32,
            email: 'minjung.yoo@company.com',
          },
        ],
      },
      {
        id: '1-5-2',
        pid: '1-5',
        name: '자금팀',
        children: [
          { id: '1-5-2-1', pid: '1-5-2', name: '김태희', position: '팀장', age: 38, email: 'taehee.kim@company.com' },
          { id: '1-5-2-2', pid: '1-5-2', name: '정수빈', position: '팀원', age: 29, email: 'subin.jung@company.com' },
        ],
      },
    ],
  },
  {
    id: '1-6',
    pid: '1',
    name: '고객지원부',
    children: [
      {
        id: '1-6-1',
        pid: '1-6',
        name: 'CS팀',
        children: [
          {
            id: '1-6-1-1',
            pid: '1-6-1',
            name: '이승민',
            position: '팀장',
            age: 35,
            email: 'seungmin.lee@company.com',
          },
          { id: '1-6-1-2', pid: '1-6-1', name: '한예지', position: '팀원', age: 28, email: 'yeji.han@company.com' },
          { id: '1-6-1-3', pid: '1-6-1', name: '박민호', position: '팀원', age: 30, email: 'minho.park@company.com' },
        ],
      },
    ],
  },
  {
    id: '1-7',
    pid: '1',
    name: 'IT부',
    children: [
      {
        id: '1-7-1',
        pid: '1-7',
        name: '네트워크팀',
        children: [
          {
            id: '1-7-1-1',
            pid: '1-7-1',
            name: '강서준',
            position: '팀장',
            age: 37,
            email: 'seojun.kang@company.com',
          },
          { id: '1-7-1-2', pid: '1-7-1', name: '이하윤', position: '팀원', age: 29, email: 'hayoon.lee@company.com' },
        ],
      },
      {
        id: '1-7-2',
        pid: '1-7',
        name: '시스템팀',
        children: [
          { id: '1-7-2-1', pid: '1-7-2', name: '조민재', position: '팀장', age: 39, email: 'minjae.jo@company.com' },
          { id: '1-7-2-2', pid: '1-7-2', name: '서예린', position: '팀원', age: 28, email: 'yerin.seo@company.com' },
        ],
      },
    ],
  },
  {
    id: '1-8',
    pid: '1',
    name: '기획부',
    children: [
      {
        id: '1-8-1',
        pid: '1-8',
        name: '전략팀',
        children: [
          {
            id: '1-8-1-1',
            pid: '1-8-1',
            name: '배수현',
            position: '팀장',
            age: 36,
            email: 'soohyun.bae@company.com',
          },
          { id: '1-8-1-2', pid: '1-8-1', name: '김지원', position: '팀원', age: 29, email: 'jiwon.kim@company.com' },
        ],
      },
    ],
  },
  {
    id: '1-9',
    pid: '1',
    name: '연구개발부',
    children: [
      {
        id: '1-9-1',
        pid: '1-9',
        name: 'R&D팀',
        children: [
          {
            id: '1-9-1-1',
            pid: '1-9-1',
            name: '유승호',
            position: '팀장',
            age: 41,
            email: 'seungho.yoo@company.com',
          },
          { id: '1-9-1-2', pid: '1-9-1', name: '한소희', position: '팀원', age: 32, email: 'sohee.han@company.com' },
          { id: '1-9-1-3', pid: '1-9-1', name: '최다빈', position: '팀원', age: 30, email: 'dabin.choi@company.com' },
        ],
      },
    ],
  },
  {
    id: '1-10',
    pid: '1',
    name: '법무부',
    children: [
      {
        id: '1-10-1',
        pid: '1-10',
        name: '법무팀',
        children: [
          {
            id: '1-10-1-1',
            pid: '1-10-1',
            name: '김현우',
            position: '팀장',
            age: 39,
            email: 'hyunwoo.kim@company.com',
          },
          { id: '1-10-1-2', pid: '1-10-1', name: '조은지', position: '팀원', age: 28, email: 'eunji.jo@company.com' },
        ],
      },
    ],
  },
];

var G_TREE_LIST_DATA = [
  { id: '1', pid: '0', name: '회사' },

  { id: '1-1', pid: '1', name: '인사부' },
  { id: '1-1-1', pid: '1-1', name: '인사팀' },
  { id: '1-1-1-1', pid: '1-1-1', name: '김철수', position: '팀장', age: 38, email: 'chulsoo.kim@company.com' },
  { id: '1-1-1-2', pid: '1-1-1', name: '박영희', position: '팀원', age: 29, email: 'younghee.park@company.com' },
  { id: '1-1-1-3', pid: '1-1-1', name: '최민호', position: '팀원', age: 31, email: 'minho.choi@company.com' },
  { id: '1-1-1-4', pid: '1-1-1', name: '이수진', position: '팀원', age: 28, email: 'sujin.lee@company.com' },

  { id: '1-1-2', pid: '1-1', name: '채용팀' },
  { id: '1-1-2-1', pid: '1-1-2', name: '정민재', position: '팀장', age: 35, email: 'minjae.jung@company.com' },
  { id: '1-1-2-2', pid: '1-1-2', name: '강하늘', position: '팀원', age: 27, email: 'haneul.kang@company.com' },
  { id: '1-1-2-3', pid: '1-1-2', name: '송지훈', position: '팀원', age: 30, email: 'jihun.song@company.com' },
  { id: '1-1-2-4', pid: '1-1-2', name: '윤서영', position: '팀원', age: 29, email: 'seoyoung.yoon@company.com' },

  { id: '1-2', pid: '1', name: '개발부' },
  { id: '1-2-1', pid: '1-2', name: '프론트엔드팀' },
  { id: '1-2-1-1', pid: '1-2-1', name: '이민수', position: '팀장', age: 37, email: 'minsoo.lee@company.com' },
  { id: '1-2-1-2', pid: '1-2-1', name: '최수진', position: '팀원', age: 30, email: 'sujin.choi@company.com' },
  { id: '1-2-1-3', pid: '1-2-1', name: '한지훈', position: '팀원', age: 28, email: 'jihun.han@company.com' },
  { id: '1-2-1-4', pid: '1-2-1', name: '박예진', position: '팀원', age: 29, email: 'yejin.park@company.com' },

  { id: '1-2-2', pid: '1-2', name: '백엔드팀' },
  { id: '1-2-2-1', pid: '1-2-2', name: '정우성', position: '팀장', age: 40, email: 'woosung.jung@company.com' },
  { id: '1-2-2-2', pid: '1-2-2', name: '한지민', position: '팀원', age: 32, email: 'jimin.han@company.com' },
  { id: '1-2-2-3', pid: '1-2-2', name: '오세훈', position: '팀원', age: 29, email: 'sehun.oh@company.com' },
  { id: '1-2-2-4', pid: '1-2-2', name: '김서연', position: '팀원', age: 31, email: 'seoyeon.kim@company.com' },

  { id: '1-3', pid: '1', name: '마케팅부' },
  { id: '1-3-1', pid: '1-3', name: '브랜드팀' },
  { id: '1-3-1-1', pid: '1-3-1', name: '김나영', position: '팀장', age: 36, email: 'nayoung.kim@company.com' },
  { id: '1-3-1-2', pid: '1-3-1', name: '박서준', position: '팀원', age: 29, email: 'seojoon.park@company.com' },
  { id: '1-3-1-3', pid: '1-3-1', name: '이하늘', position: '팀원', age: 28, email: 'haneul.lee@company.com' },

  { id: '1-3-2', pid: '1-3', name: '콘텐츠팀' },
  { id: '1-3-2-1', pid: '1-3-2', name: '정다은', position: '팀장', age: 34, email: 'daeun.jung@company.com' },
  { id: '1-3-2-2', pid: '1-3-2', name: '송유진', position: '팀원', age: 27, email: 'yujin.song@company.com' },
  { id: '1-3-2-3', pid: '1-3-2', name: '오민재', position: '팀원', age: 30, email: 'minjae.oh@company.com' },

  { id: '1-4', pid: '1', name: '영업부' },
  { id: '1-4-1', pid: '1-4', name: '국내영업팀' },
  { id: '1-4-1-1', pid: '1-4-1', name: '강민혁', position: '팀장', age: 39, email: 'minhyuk.kang@company.com' },
  { id: '1-4-1-2', pid: '1-4-1', name: '유지훈', position: '팀원', age: 31, email: 'jihun.yoo@company.com' },
  { id: '1-4-1-3', pid: '1-4-1', name: '김소연', position: '팀원', age: 28, email: 'soyeon.kim@company.com' },

  { id: '1-4-2', pid: '1-4', name: '해외영업팀' },
  { id: '1-4-2-1', pid: '1-4-2', name: '박현수', position: '팀장', age: 40, email: 'hyunsu.park@company.com' },
  { id: '1-4-2-2', pid: '1-4-2', name: '이예진', position: '팀원', age: 29, email: 'yejin.lee@company.com' },
  { id: '1-4-2-3', pid: '1-4-2', name: '최민기', position: '팀원', age: 30, email: 'minki.choi@company.com' },

  { id: '1-5', pid: '1', name: '재무부' },
  { id: '1-5-1', pid: '1-5', name: '회계팀' },
  { id: '1-5-1-1', pid: '1-5-1', name: '홍길동', position: '팀장', age: 41, email: 'gildong.hong@company.com' },
  { id: '1-5-1-2', pid: '1-5-1', name: '유민정', position: '팀원', age: 32, email: 'minjung.yoo@company.com' },

  { id: '1-5-2', pid: '1-5', name: '자금팀' },
  { id: '1-5-2-1', pid: '1-5-2', name: '김태희', position: '팀장', age: 38, email: 'taehee.kim@company.com' },
  { id: '1-5-2-2', pid: '1-5-2', name: '정수빈', position: '팀원', age: 29, email: 'subin.jung@company.com' },

  { id: '1-6', pid: '1', name: '고객지원부' },
  { id: '1-6-1', pid: '1-6', name: 'CS팀' },
  { id: '1-6-1-1', pid: '1-6-1', name: '이승민', position: '팀장', age: 35, email: 'seungmin.lee@company.com' },
  { id: '1-6-1-2', pid: '1-6-1', name: '한예지', position: '팀원', age: 28, email: 'yeji.han@company.com' },
  { id: '1-6-1-3', pid: '1-6-1', name: '박민호', position: '팀원', age: 30, email: 'minho.park@company.com' },

  { id: '1-7', pid: '1', name: 'IT부' },
  { id: '1-7-1', pid: '1-7', name: '네트워크팀' },
  { id: '1-7-1-1', pid: '1-7-1', name: '강서준', position: '팀장', age: 37, email: 'seojun.kang@company.com' },
  { id: '1-7-1-2', pid: '1-7-1', name: '이하윤', position: '팀원', age: 29, email: 'hayoon.lee@company.com' },

  { id: '1-7-2', pid: '1-7', name: '시스템팀' },
  { id: '1-7-2-1', pid: '1-7-2', name: '조민재', position: '팀장', age: 39, email: 'minjae.jo@company.com' },
  { id: '1-7-2-2', pid: '1-7-2', name: '서예린', position: '팀원', age: 28, email: 'yerin.seo@company.com' },

  { id: '1-8', pid: '1', name: '기획부' },
  { id: '1-8-1', pid: '1-8', name: '전략팀' },
  { id: '1-8-1-1', pid: '1-8-1', name: '배수현', position: '팀장', age: 36, email: 'soohyun.bae@company.com' },
  { id: '1-8-1-2', pid: '1-8-1', name: '김지원', position: '팀원', age: 29, email: 'jiwon.kim@company.com' },

  { id: '1-9', pid: '1', name: '연구개발부' },
  { id: '1-9-1', pid: '1-9', name: 'R&D팀' },
  { id: '1-9-1-1', pid: '1-9-1', name: '유승호', position: '팀장', age: 41, email: 'seungho.yoo@company.com' },
  { id: '1-9-1-2', pid: '1-9-1', name: '한소희', position: '팀원', age: 32, email: 'sohee.han@company.com' },
  { id: '1-9-1-3', pid: '1-9-1', name: '최다빈', position: '팀원', age: 30, email: 'dabin.choi@company.com' },

  { id: '1-10', pid: '1', name: '법무부' },
  { id: '1-10-1', pid: '1-10', name: '법무팀' },
  { id: '1-10-1-1', pid: '1-10-1', name: '김현우', position: '팀장', age: 39, email: 'hyunwoo.kim@company.com' },
  { id: '1-10-1-2', pid: '1-10-1', name: '조은지', position: '팀원', age: 28, email: 'eunji.jo@company.com' },
];
