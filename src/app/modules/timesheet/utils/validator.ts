export const VALIDATION_MESSAGE: any = {
  required: 'Kolom %s tidak boleh kosong',
  endTimeValidator: 'End time tidak boleh sebelum start time',
};

// fungsi ini akan membentuk sebuah pesan validasi sesuai dengan validators yang diterima
export function formatValidationMessage(
  message: string,
  ...params: any[]
): string {
  return message.replace(/%s/g, () => params.shift());
}
