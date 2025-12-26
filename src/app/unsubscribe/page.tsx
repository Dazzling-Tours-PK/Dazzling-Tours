"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const UnsubscribeContent = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const email = searchParams.get("email");
  const error = searchParams.get("error");
  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "true") {
      setStatus("success");
      setMessage(
        "You have been successfully unsubscribed from our newsletter."
      );
    } else if (error) {
      setStatus("error");
      switch (error) {
        case "missing_email":
          setMessage("Email address is required to unsubscribe.");
          break;
        case "invalid_token":
          setMessage("Invalid unsubscribe link. Please try again.");
          break;
        case "not_found":
          setMessage("Email address not found in our subscriber list.");
          break;
        default:
          setMessage("An error occurred. Please try again later.");
      }
    } else if (email) {
      // Auto-unsubscribe if email and token are present
      const token = searchParams.get("token");
      if (token) {
        handleUnsubscribe(email, token);
      } else {
        setStatus("error");
        setMessage("Invalid unsubscribe link.");
      }
    } else {
      setStatus("error");
      setMessage("No email address provided.");
    }
  }, [searchParams, email, error, success]);

  const handleUnsubscribe = async (email: string, token: string) => {
    try {
      const response = await fetch(
        `/api/newsletter/unsubscribe?email=${encodeURIComponent(
          email
        )}&token=${encodeURIComponent(token)}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage(
          "You have been successfully unsubscribed from our newsletter."
        );
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to unsubscribe. Please try again.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setStatus("error");
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "40px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <Image
            src="/assets/img/logo dazzling/Dazzling Tours Png.png"
            alt="Dazzling Tours"
            width={120}
            height={120}
            style={{ margin: "0 auto" }}
          />
        </div>

        {status === "loading" && (
          <>
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #667eea",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            />
            <p style={{ color: "#6c757d" }}>Processing your request...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#e8f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <i
                className="bi bi-check-circle-fill"
                style={{ fontSize: "40px", color: "#388e3c" }}
              />
            </div>
            <h1 style={{ color: "#333", marginBottom: "15px" }}>
              Unsubscribed Successfully
            </h1>
            <p style={{ color: "#6c757d", marginBottom: "30px" }}>{message}</p>
            {email && (
              <p style={{ fontSize: "14px", color: "#999" }}>Email: {email}</p>
            )}
            <div style={{ marginTop: "30px" }}>
              <Link
                href="/"
                style={{
                  display: "inline-block",
                  padding: "12px 30px",
                  background: "#667eea",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "5px",
                }}
              >
                Return to Homepage
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#ffebee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <i
                className="bi bi-x-circle-fill"
                style={{ fontSize: "40px", color: "#d32f2f" }}
              />
            </div>
            <h1 style={{ color: "#333", marginBottom: "15px" }}>
              Unsubscribe Failed
            </h1>
            <p style={{ color: "#6c757d", marginBottom: "30px" }}>{message}</p>
            <div style={{ marginTop: "30px" }}>
              <Link
                href="/"
                style={{
                  display: "inline-block",
                  padding: "12px 30px",
                  background: "#667eea",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "5px",
                  marginRight: "10px",
                }}
              >
                Return to Homepage
              </Link>
              <Link
                href="/contact"
                style={{
                  display: "inline-block",
                  padding: "12px 30px",
                  background: "transparent",
                  color: "#667eea",
                  textDecoration: "none",
                  borderRadius: "5px",
                  border: "1px solid #667eea",
                }}
              >
                Contact Support
              </Link>
            </div>
          </>
        )}

        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

const UnsubscribePage = () => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "40px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #667eea",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            />
            <p style={{ color: "#6c757d" }}>Loading...</p>
          </div>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
};

export default UnsubscribePage;
