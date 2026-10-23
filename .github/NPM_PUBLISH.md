# npm 자동 배포 설정

`publish-npm.yml`은 `main` push마다 마지막 커밋의 `package.json.version`과 직전 커밋(`HEAD^`)의 값을 비교한다. 버전이 같으면 의존성 설치·검증·배포 job 전체를 건너뛴다. 여러 커밋을 한 번에 push해도 비교 대상은 마지막 두 커밋이다. 부모가 없는 최초 커밋은 배포하지 않으며, 부모의 package.json을 읽을 수 없으면 실패한다.

버전이 바뀌면 Node.js 24, npm 11, Yarn 1.22.22 환경에서 설치 → `yarn test --runInBand` → `yarn build` → `npm publish` 순서로 실행한다. 검증 실패 시 배포하지 않는다. 기존 `prepublishOnly`도 빌드하므로 배포 명령에 `--ignore-scripts`를 사용해 중복 빌드를 생략한다. 기존 소스·package scripts는 변경하지 않는다.

현재 Node 버전 지정 파일과 engines 설정은 없으며, packageManager는 Yarn 1.22.22다. Git에 추적된 yarn.lock이나 package-lock.json은 없다. 따라서 `yarn install --no-lockfile`을 사용하며 의존성의 정확한 버전 재현은 보장되지 않는다. 추후 yarn.lock을 별도 검토해 커밋하면 설치 명령을 `yarn install --frozen-lockfile --non-interactive`로 변경할 수 있다.

## 권장: Trusted Publishing (OIDC)

1. npmjs.com의 `@daracl/grid` 패키지 **Settings → Trusted Publisher**에서 GitHub Actions를 선택한다.
2. GitHub organization/user: `daracl`, repository: `ui-grid`, workflow filename: `publish-npm.yml`을 등록한다. fork에서 사용한다면 실제 소유자와 저장소를 입력한다.
3. 이 workflow는 GitHub Environment를 사용하지 않으므로 environment 항목은 비워 둔다.
4. GitHub Actions를 활성화하고 저장소 변수 `NPM_AUTH_MODE`는 생략하거나 `oidc`로 설정한다. `NPM_TOKEN`은 필요하지 않다.
5. 사용하지 않는 기존 배포 토큰은 폐기하고, npm 패키지 설정에서 토큰 배포 차단을 선택할 수 있다.

GitHub 호스팅 Ubuntu runner와 `id-token: write` 권한을 사용한다. Node.js 24와 npm 11은 OIDC 최소 요구사항(Node.js 22.14.0, npm 11.5.1)을 충족한다. npm에 패키지가 아직 없다면 최초 수동 배포 후 Trusted Publisher를 등록한다. OIDC 실패 시 자동으로 토큰을 재시도하지 않는다. 저장소·workflow 이름과 npm 등록 정보를 먼저 확인한다.

공식 안내: https://docs.npmjs.com/trusted-publishers/

## 대안: NPM_TOKEN

Trusted Publishing을 사용할 수 없는 경우에만 아래를 설정한다.

1. npm에서 `@daracl/grid`에 쓰기 권한이 있는 granular access token을 발급한다. 패키지의 2FA·토큰 배포 정책에서 비대화형 배포가 허용되어야 한다.
2. GitHub 저장소 **Settings → Secrets and variables → Actions → Secrets**에 `NPM_TOKEN`을 등록한다.
3. 같은 화면의 **Variables**에 `NPM_AUTH_MODE=token`을 등록한다.

토큰은 publish 단계에만 전달된다. 만료 전에 갱신해야 하며, npm에서 토큰 배포를 차단했다면 이 방식은 사용할 수 없다.

## 배포 및 확인

- 새 npm 버전으로 package.json을 변경해 `main`에 push한다. 이미 게시된 버전은 재게시할 수 없으며 npm publish가 실패한다.
- Actions의 `Publish to npm` 실행에서 버전 비교와 test/build/publish 결과를 확인한다.
- 버전을 변경하지 않은 후속 커밋에서는 publish job이 skipped인지 확인한다.
- 실패한 배포는 원인을 해결한 뒤 해당 Actions 실행을 다시 실행할 수 있다. 이미 게시된 실행의 재실행은 중복 버전 오류로 실패한다.
- 전체 build는 기존 스크립트를 그대로 실행한다. `copy-html`의 원본 `public/index.html`이 현재 없으므로 이 복사 단계가 실제 runner에서 어떻게 동작하는지 로그를 확인한다. 배포물의 내용은 기존 빌드 설정에 따른다.
