import { gridDataSearch } from '../../src/util/searchUtils';

/*
export type SearchMode = {
  matchCase?: boolean;
  matchWholeWord?: boolean;
  useRegex?: boolean;
  searchFields?: string | string[] | "$all$";
};

*/

describe('gridDataSearch', () => {
  // 사용 예시

  it('name check', () => {
    const result = gridDataSearch(employeeList, '김민수', { searchFields: 'name' });
    expect(1).toEqual(result.length);
    expect(result[0].name).toBe('김민수');
  });

  it('useRegex name check', () => {
    const result = gridDataSearch(employeeList, '백엔드|디자이너', { searchFields: 'position', useRegex: true });
    // 실제로 "백엔드" 또는 "디자이너"가 포함된 position을 가진 사람 수
    // "백엔드 개발자": 3명, "UI/UX 디자이너": 1명, "그래픽 디자이너": 1명, "UX 디자이너": 1명, "웹 디자이너": 1명
    // 총 7명
    expect(result.length).toBe(7);
    expect(result.map((r) => r.position)).toEqual(
      expect.arrayContaining(['백엔드 개발자', 'UI/UX 디자이너', '그래픽 디자이너', 'UX 디자이너', '웹 디자이너']),
    );
  });

  it('new line check', () => {
    const result = gridDataSearch(employeeList, '전략적으로\n 문제를', { searchFields: '$all$' });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('김민수');
  });

  it('empty searchText returns all items', () => {
    const result = gridDataSearch(employeeList, '', { searchFields: 'name' });

    expect(result.length).toBe(employeeList.length);
  });

  it('matchCase: true should be case sensitive', () => {
    const result1 = gridDataSearch(employeeList, 'minsu.kim@example.com', { searchFields: 'email', matchCase: true });
    expect(result1.length).toBe(1);

    const result2 = gridDataSearch(employeeList, 'MINSU.KIM@EXAMPLE.COM', { searchFields: 'email', matchCase: true });
    expect(result2.length).toBe(0);
  });

  it('matchCase: false should be case insensitive', () => {
    const result = gridDataSearch(employeeList, 'MINSU.KIM@EXAMPLE.COM', { searchFields: 'email', matchCase: false });
    expect(result.length).toBe(1);
  });

  it('matchWholeWord: true should match whole word only', () => {
    // "개발자"는 여러 position에 포함되지만, "프론트엔드 개발자"에서 "프론트엔드"만 검색하면 "프론트엔드 개발자"만 나와야 함
    const result = gridDataSearch(employeeList, '프론트엔드', { searchFields: 'position', matchWholeWord: true });

    expect(result.length).toBe(3); // "프론트엔드 개발자", "주니어 프론트엔드 개발자"
    expect(result.map((r) => r.position)).toEqual(
      expect.arrayContaining(['프론트엔드 개발자', '주니어 프론트엔드 개발자']),
    );
  });

  it('searchFields: array should search multiple fields', () => {
    const result = gridDataSearch(employeeList, '문제', { searchFields: ['desc', 'position'] });
    // "문제"가 desc나 position에 포함된 사람
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((r) => r.name === '김민수')).toBe(true);
    expect(result.some((r) => r.name === '오세훈')).toBe(true);
    expect(result.some((r) => r.name === '정지훈')).toBe(true);
  });

  it('useRegex: invalid regex falls back to text search', () => {
    const result = gridDataSearch(employeeList, '[', { searchFields: 'desc', useRegex: true });
    // Invalid regex, should fallback to normal text search, which will not match anything
    expect(result.length).toBe(0);
  });

  it('searchFields: $all$ should search all fields', () => {
    const result = gridDataSearch(employeeList, 'PM', { searchFields: '$all$' });
    // "PM"이 포함된 사람: "프로덕트 매니저"의 배수지
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('배수지');
  });

  it('should highlight matched text in result', () => {
    const result = gridDataSearch(employeeList, '김민수', { searchFields: 'name' });
    expect(result[0].$$matchedFields[0].highlightedValue).toContain('<mark>김민수</mark>');
  });

  it('should not match partial word when matchWholeWord is true', () => {
    // "엔지니어"는 "QA 엔지니어", "AI 엔지니어", "API 엔지니어", "클라우드 엔지니어" 등에서만 완전 일치
    const result = gridDataSearch(employeeList, '엔지니어', { searchFields: 'position', matchWholeWord: true });
    expect(result.length).toBe(6);
    expect(result.map((r) => r.position)).toEqual(
      expect.arrayContaining([
        'QA 엔지니어',
        'AI 엔지니어',
        'API 엔지니어',
        '클라우드 엔지니어',
        '소프트웨어 엔지니어',
        '데브옵스 엔지니어',
      ]),
    );
  });

  it('should match numbers as string', () => {
    const result = gridDataSearch(employeeList, '34', { searchFields: 'age' });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('김민수');
  });

  it('should return empty array if no match', () => {
    const result = gridDataSearch(employeeList, '없는이름', { searchFields: 'name' });
    expect(result.length).toBe(0);
  });
});

const employeeList = [
  {
    name: '김민수',
    age: 34,
    desc: '전략적으로\n 문제를 해결하는 데 능숙합니다.',
    email: 'minsu.kim@example.com',
    birth: '1990-08-22',
    position: '프론트엔드 개발자',
  },
  {
    name: '이서연',
    age: 29,
    desc: '팀워크를 중요시하며 적극적인 성격입니다.',
    email: 'seoyeon.lee@example.com',
    birth: '1995-01-17',
    position: 'UI/UX 디자이너',
  },
  {
    name: '박지훈',
    age: 42,
    desc: '복잡한 시스템 설계에 강점을 가지고 있습니다.',
    email: 'jihun.park@example.com',
    birth: '1982-12-03',
    position: '백엔드 개발자',
  },
  {
    name: '최유진',
    age: 31,
    desc: '사용자 중심의 디자인에 열정을 가지고 있습니다.',
    email: 'yujin.choi@example.com',
    birth: '1993-04-09',
    position: 'UX 리서처',
  },
  {
    name: '정우성',
    age: 38,
    desc: '끊임없이 배우고 도전하는 개발자입니다.',
    email: 'woosung.jung@example.com',
    birth: '1986-06-15',
    position: '모바일 앱 개발자',
  },
  {
    name: '한지민',
    age: 27,
    desc: '꼼꼼한 성격으로 QA 업무에 적합합니다.',
    email: 'jimin.han@example.com',
    birth: '1997-03-02',
    position: 'QA 엔지니어',
  },
  {
    name: '송지호',
    age: 35,
    desc: '효율적인 코드 작성에 집중하는 스타일입니다.',
    email: 'jiho.song@example.com',
    birth: '1989-07-21',
    position: '풀스택 개발자',
  },
  {
    name: '배수지',
    age: 30,
    desc: '프로덕트의 전체 흐름을 고려하는 PM입니다.',
    email: 'suji.bae@example.com',
    birth: '1994-11-30',
    position: '프로덕트 매니저',
  },
  {
    name: '윤도현',
    age: 45,
    desc: '대규모 시스템 운영 경험이 있습니다.',
    email: 'dohyun.yoon@example.com',
    birth: '1979-09-10',
    position: '시스템 아키텍트',
  },
  {
    name: '서현우',
    age: 26,
    desc: '신기술을 빠르게 학습하는 능력이 뛰어납니다.',
    email: 'hyunwoo.seo@example.com',
    birth: '1998-01-27',
    position: 'AI 엔지니어',
  },
  {
    name: '문채원',
    age: 33,
    desc: '커뮤니케이션 능력이 뛰어난 디자이너입니다.',
    email: 'chaewon.moon@example.com',
    birth: '1991-10-11',
    position: '그래픽 디자이너',
  },
  {
    name: '장혁',
    age: 36,
    desc: '데이터 기반 의사결정을 중요시합니다.',
    email: 'hyuk.jang@example.com',
    birth: '1988-05-14',
    position: '데이터 분석가',
  },
  {
    name: '권은비',
    age: 28,
    desc: '창의적인 콘텐츠 기획에 능합니다.',
    email: 'eunbi.kwon@example.com',
    birth: '1996-09-04',
    position: '콘텐츠 마케터',
  },
  {
    name: '오세훈',
    age: 40,
    desc: '복잡한 문제를 체계적으로 해결합니다.',
    email: 'sehun.oh@example.com',
    birth: '1984-12-25',
    position: '데브옵스 엔지니어',
  },
  {
    name: '김다은',
    age: 24,
    desc: '트렌디한 디자인 감각이 뛰어납니다.',
    email: 'daeun.kim@example.com',
    birth: '2000-08-07',
    position: '웹 디자이너',
  },
  {
    name: '임지민',
    age: 32,
    desc: '유지보수와 문서화에 능숙한 개발자입니다.',
    email: 'jimin.lim@example.com',
    birth: '1992-06-06',
    position: '백엔드 개발자',
  },
  {
    name: '노윤호',
    age: 41,
    desc: '협업과 조율 능력이 탁월한 리더입니다.',
    email: 'yunho.noh@example.com',
    birth: '1983-04-17',
    position: '기술 리더',
  },
  {
    name: '이하늘',
    age: 37,
    desc: '사용자 경험을 최우선으로 합니다.',
    email: 'haneul.lee@example.com',
    birth: '1987-01-29',
    position: 'UX 디자이너',
  },
  {
    name: '신예은',
    age: 31,
    desc: '글로벌 서비스를 운영한 경험이 있습니다.',
    email: 'yeeun.shin@example.com',
    birth: '1993-12-08',
    position: '서비스 기획자',
  },
  {
    name: '황민재',
    age: 39,
    desc: '테스트 자동화에 전문성을 가지고 있습니다.',
    email: 'minjae.hwang@example.com',
    birth: '1985-03-13',
    position: 'QA 매니저',
  },
  {
    name: '윤하늘',
    age: 22,
    desc: '학습 열정이 높은 신입 개발자입니다.',
    email: 'haneul.yoon@example.com',
    birth: '2002-07-01',
    position: '주니어 프론트엔드 개발자',
  },
  {
    name: '백승훈',
    age: 35,
    desc: 'REST API 설계 경험이 풍부합니다.',
    email: 'seunghoon.baek@example.com',
    birth: '1989-10-20',
    position: 'API 엔지니어',
  },
  {
    name: '안소희',
    age: 30,
    desc: '제품 출시부터 운영까지 경험이 많습니다.',
    email: 'sohee.ahn@example.com',
    birth: '1994-02-05',
    position: '프로덕트 오너',
  },
  {
    name: '정지훈',
    age: 27,
    desc: '논리적인 사고를 기반으로 문제를 해결합니다.',
    email: 'jihoon.jung@example.com',
    birth: '1997-08-26',
    position: '백엔드 개발자',
  },
  {
    name: '한예슬',
    age: 44,
    desc: '효율적인 운영 체계 설계에 강합니다.',
    email: 'yesle.han@example.com',
    birth: '1980-09-09',
    position: '운영 매니저',
  },
  {
    name: '서진우',
    age: 33,
    desc: '마이크로서비스 아키텍처에 관심이 많습니다.',
    email: 'jinwoo.seo@example.com',
    birth: '1991-05-24',
    position: '소프트웨어 엔지니어',
  },
  {
    name: '조민아',
    age: 29,
    desc: '사용자 데이터를 분석하여 인사이트를 도출합니다.',
    email: 'mina.jo@example.com',
    birth: '1995-11-14',
    position: '데이터 사이언티스트',
  },
  {
    name: '홍시우',
    age: 36,
    desc: '클라우드 인프라 경험이 풍부합니다.',
    email: 'siwoo.hong@example.com',
    birth: '1988-02-18',
    position: '클라우드 엔지니어',
  },
  {
    name: '강하늘',
    age: 25,
    desc: '문제 해결에 대한 열정이 강합니다.',
    email: 'haneul.kang@example.com',
    birth: '1999-06-30',
    position: '프론트엔드 개발자',
  },
  {
    name: '김나현',
    age: 23,
    desc: '스타트업 환경에 잘 적응하는 성격입니다.',
    email: 'nahyun.kim@example.com',
    birth: '2001-03-11',
    position: '인턴 개발자',
  },
];
