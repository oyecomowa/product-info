import { useEffect, ReactNode } from "react";

interface AlertProps {
  type: "error" | "success" | "warning" | "info";
  title: string;
  message: string;
  children?: ReactNode;
  onClose: () => void;
  primaryButton?: {
    label: string;
    onClick: () => void;
  };
  secondaryButton?: {
    label: string;
    onClick: () => void;
  };
  autoClose?: boolean;
  autoCloseDuration?: number;
}

const AlertIcon = {
  error: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2M7.08 7.08a8 8 0 1111.84 11.84m0 0l2.12 2.12" />
    </svg>
  ),
  success: (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  info: (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  ),
};

const alertStyles = {
  error: {
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    titleColor: "text-gray-900",
    messageColor: "text-gray-600",
  },
  success: {
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    titleColor: "text-gray-900",
    messageColor: "text-gray-600",
  },
  warning: {
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    titleColor: "text-gray-900",
    messageColor: "text-gray-600",
  },
  info: {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    titleColor: "text-gray-900",
    messageColor: "text-gray-600",
  },
};

export default function Alert({
  type,
  title,
  message,
  children,
  onClose,
  primaryButton,
  secondaryButton,
  autoClose = false,
  autoCloseDuration = 5000,
}: AlertProps) {
  useEffect(() => {
    if (!autoClose) return;

    const timer = setTimeout(onClose, autoCloseDuration);
    return () => clearTimeout(timer);
  }, [autoClose, autoCloseDuration, onClose]);

  const styles = alertStyles[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Alert Box */}
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 transition hover:bg-gray-100"
          aria-label="Close"
        >
          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content Container - Centered */}
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`rounded-full ${styles.iconBg} p-3 ${styles.iconColor} mb-4`}>{AlertIcon[type]}</div>

          {/* Title */}
          <h3 className={`${styles.titleColor} text-lg font-semibold`}>{title}</h3>

          {/* Message */}
          <p className={`${styles.messageColor} mt-2 text-sm`}>{message}</p>

          {/* Children Content */}
          {children ? <div className={`${styles.messageColor} mt-4 text-sm`}>{children}</div> : null}

          {/* Buttons */}
          <div className="mt-6 flex w-full flex-col gap-3">
            {primaryButton && (
              <button
                onClick={primaryButton.onClick}
                className="rounded-md bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 active:bg-black"
              >
                {primaryButton.label}
              </button>
            )}
            {secondaryButton && (
              <button
                onClick={secondaryButton.onClick}
                className="rounded-md border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-900 transition hover:bg-gray-50 active:bg-white"
              >
                {secondaryButton.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
