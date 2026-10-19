/** Nối class name, bỏ qua giá trị falsy — dùng để ghép class từ css module. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
