import { convertToTimeFormatFromSec } from './TimeField';

describe('秒からHH:mm:ssへの変換処理', () => {
  test('正しい形式に変換される', () => {
    const actual = convertToTimeFormatFromSec(3600);
    expect(actual).toBe('01:00:00');
  });

  test('数字が1桁のとき、ゼロパディングされる', () => {
    const actual = convertToTimeFormatFromSec(3661);
    expect(actual).toBe('01:01:01');
  });

  test('数字が2桁のときはゼロパディングされない', () => {
    const actual = convertToTimeFormatFromSec(3661);
    expect(actual).toBe('01:01:01');
  });

  test('指定された値が0より小さい値の時、00:00:00となる', () => {
    const actual = convertToTimeFormatFromSec(-1);
    expect(actual).toBe('00:00:00');
  });

  test('指定された値が表示できる最大値より大きい時、99:59:59になる', () => {
    const actual = convertToTimeFormatFromSec(10000000000);
    expect(actual).toBe('99:59:59');
  });
});
