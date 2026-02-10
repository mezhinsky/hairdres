import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Парикмахер-стилист Ольга Делова";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #f5e6d8 0%, #e8d5c4 50%, #d4a886 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#c47d5a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "32px",
            }}
          >
            ✂
          </div>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            color: "#3d2b1f",
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          Парикмахер Ольга Делова
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#6b4c3b",
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          Стрижки · Окрашивание · Укладки · Уход
        </div>
        <div
          style={{
            fontSize: "22px",
            color: "#8b6f5e",
            display: "flex",
            gap: "24px",
          }}
        >
          <span>Москва, Северное Бутово</span>
          <span>·</span>
          <span>Онлайн-запись на сайте</span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "20px",
            color: "#a08876",
          }}
        >
          olgadelova.ru
        </div>
      </div>
    ),
    { ...size }
  );
}
