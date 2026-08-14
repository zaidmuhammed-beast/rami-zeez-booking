import QRCode from "qrcode";

export async function generateQrDataUrl(value: string) {
  return QRCode.toDataURL(value, {
    margin: 1,
    width: 320,
    color: { dark: "#1e1033", light: "#f3e9dc" },
  });
}

// QR codes encode a full confirmation URL so any camera app can open them.
// The check-in scanner needs just the booking ref back out of that URL
// (or the raw ref, for manual entry / older QR codes still in the wild).
export function extractBookingRef(scannedText: string) {
  const trimmed = scannedText.trim();
  const match = trimmed.match(/\/confirmation\/([A-Z0-9-]+)/i);
  return (match ? match[1] : trimmed).toUpperCase();
}
