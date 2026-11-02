/**
 * 배열·일반 객체·Date·RegExp·Map·Set을 복사하고 순환·공유 참조를 유지합니다.
 * 클래스·DOM 등 기타 객체와 함수는 참조를 유지합니다.
 * 문자열·Symbol의 열거 가능한 자체 속성을 복사하되 __proto__·constructor·prototype은 제외합니다.
 * 접근자는 값을 읽어 일반 속성으로 복사합니다. seen은 호출 간 참조 표를 공유할 때 사용합니다.
 */
export declare const deepCopy: (value: any, seen?: WeakMap<object, any>) => any;
