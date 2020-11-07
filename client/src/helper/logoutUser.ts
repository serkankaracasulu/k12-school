export default function() {
  localStorage.removeItem("token");
  window.location.href = "/";
}
