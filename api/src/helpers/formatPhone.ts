export function formatPhone(phone: string) {
  const symbolsToReplace = ['(', ')', ' ', '-'];

  return symbolsToReplace.reduce(
    (newPhone: string, symbol) => newPhone.split(symbol).join(''),
    phone,
  );
}
