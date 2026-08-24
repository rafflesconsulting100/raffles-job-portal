import { toast } from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      border: '1px solid #10B981',
      padding: '16px',
      color: '#064E3B',
      background: '#ECFDF5',
      fontWeight: '600',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    iconTheme: {
      primary: '#10B981',
      secondary: '#FFFFFF',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    style: {
      border: '1px solid #EF4444',
      padding: '16px',
      color: '#7F1D1D',
      background: '#FEF2F2',
      fontWeight: '600',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    iconTheme: {
      primary: '#EF4444',
      secondary: '#FFFFFF',
    },
  });
};

export const showLoading = (message) => {
  return toast.loading(message, {
    style: {
      border: '1px solid #3B82F6',
      padding: '16px',
      color: '#1E3A8A',
      background: '#EFF6FF',
      fontWeight: '600',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};
