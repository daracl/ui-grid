export function createExampleFields1() {
  return [
    { name: 'name', label: '조직', width: 260, renderer: { type: 'tree' } },
    { name: 'path', label: '조직 경로', width: 340 },
    { name: 'members', label: '인원', width: 140, renderer: { type: 'number' } },
  ];
}

export function createExampleItems2() {
  return [
    {
      id: 'dev',
      name: '개발부',
      path: '개발부',
      members: 18,
      children: [
        {
          id: 'platform',
          name: '플랫폼팀',
          path: '개발부 / 플랫폼팀',
          members: 12,
          children: [
            { id: 'api', name: 'API 파트', path: '개발부 / 플랫폼팀 / API 파트', members: 7 },
            { id: 'web', name: '웹 파트', path: '개발부 / 플랫폼팀 / 웹 파트', members: 5 },
          ],
        },
        {
          id: 'service',
          name: '서비스팀',
          path: '개발부 / 서비스팀',
          members: 6,
          children: [{ id: 'admin', name: '운영 파트', path: '개발부 / 서비스팀 / 운영 파트', members: 6 }],
        },
      ],
    },
    {
      id: 'sales',
      name: '영업부',
      path: '영업부',
      members: 10,
      children: [
        { id: 'domestic', name: '국내팀', path: '영업부 / 국내팀', members: 6 },
        { id: 'overseas', name: '해외팀', path: '영업부 / 해외팀', members: 4 },
      ],
    },
  ];
}
