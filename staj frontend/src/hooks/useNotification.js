import { useCallback } from 'react';
import { toast } from 'react-toastify';

const useNotification = () => {
  const notify = useCallback((msg, type = 'info') => {
    toast.dismiss(); // önceki toast'ları kapatır
    if (type === 'success') toast.success(msg);
    else if (type === 'error') toast.error(msg);
    else toast.info(msg);
  }, []);

  return { notify };
};

export default useNotification;