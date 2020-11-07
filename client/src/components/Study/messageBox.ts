export default {
  codeBAD_USER_INPUT: { message: "Hatalı veri giriş", variant: "error" },
  success: { message: "Etüt kayıt edildi.", variant: "success" },
  failed: { message: "Kayıt başarısız.", variant: "error" },
  UNAUTHENTICATED: { message: "Yetkisiz işlem", variant: "error" },
  code200: {
    message: "Bu zaman aralığında başka etütün var",
    variant: "warning"
  },
  code203: {
    message: "Etüt kapasistesi dolu",
    variant: "warning"
  },
  code202: {
    message: "Etüt bulunamadı veya uygun değil",
    variant: "error"
  }
};
