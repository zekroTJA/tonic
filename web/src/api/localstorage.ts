/** @format */

enum Key {
  ITEMS_PER_PAGE = 'tonic_items_per_page',
}

interface Transformer<T> {
  decode(v: string | null): T | null;
  encode(v: T): string;
}

class TNumber implements Transformer<number> {
  public decode(v: string | null): number | null {
    return v ? parseInt(v, 16) : null;
  }

  public encode(v: number): string {
    return v.toString(16);
  }
}

export default class LocalStorageAPI {
  public static get itemsPerPage(): number | null {
    return this.getItem(Key.ITEMS_PER_PAGE, new TNumber());
  }

  public static set itemsPerPage(v: number | null) {
    if (!v) return;
    this.setItem(Key.ITEMS_PER_PAGE, v, new TNumber());
  }

  private static getItem<T>(
    key: string,
    transformer: Transformer<T>
  ): T | null {
    const val = window.localStorage.getItem(key);
    return transformer.decode(val);
  }

  private static setItem<T>(key: string, val: T, transformer: Transformer<T>) {
    const valStr = transformer.encode(val);
    window.localStorage.setItem(key, valStr);
  }
}
