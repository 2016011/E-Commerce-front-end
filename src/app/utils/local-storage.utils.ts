// localStorage storag items global access
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorageTest__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}