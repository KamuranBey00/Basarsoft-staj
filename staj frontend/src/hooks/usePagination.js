import { useState } from 'react';

const usePagination = (initialPage = 1, pageSize = 5) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPaged = async (baseUrl, mapper, notify) => {
    // Eğer zaten yükleniyor veya daha fazla veri yoksa, fetch yapma
    if (loading || !hasMore) {
      console.log(`⏸️ Skipping fetch - loading: ${loading}, hasMore: ${hasMore}`);
      return;
    }

    setLoading(true);
    
    try {
      console.log(`🔄 Fetching page ${page} from ${baseUrl}`);
      const res = await fetch(`${baseUrl}/paged?pageNumber=${page}&pageSize=${pageSize}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);

      const responseData = await res.json();
      console.log(`📦 Response for ${baseUrl}:`, {
        currentPage: page,
        itemsReceived: responseData.items?.length || 0,
        totalCount: responseData.totalCount,
        items: responseData.items
      });

      // Eğer response boş ise veya items yoksa
      if (!responseData.items || responseData.items.length === 0) {
        console.log('🏁 No items received, stopping pagination');
        setHasMore(false);
        return;
      }

      const mapped = responseData.items.map(mapper);
      console.log(`✅ Mapped ${mapped.length} items`);

      setData(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const newItems = mapped.filter(item => !existingIds.has(item.id));
        console.log(`🆕 Adding ${newItems.length} new items (filtered ${mapped.length - newItems.length} duplicates)`);
        return [...prev, ...newItems];
      });

      // Page artırımını sadece başarılı fetch'ten sonra yap
      const nextPage = page + 1;
      setPage(nextPage);
      console.log(`📄 Page updated: ${page} -> ${nextPage}`);

      // Gelen veri pageSize'dan az ise daha fazla veri yok
      if (responseData.items.length < pageSize) {
        console.log(`🏁 End of data reached (${responseData.items.length} < ${pageSize})`);
        setHasMore(false);
      }

    } catch (err) {
      console.error('💥 Paged fetch error:', err);
      console.error('🔍 Error context:', {
        url: baseUrl,
        currentPage: page,
        pageSize
      });
      notify?.('Veri yüklenirken hata oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = (baseUrl, mapper, notify) => {
    console.log(`🚀 LoadMore called for ${baseUrl} - Current page: ${page}, hasMore: ${hasMore}, loading: ${loading}`);
    
    // Double-click koruması
    if (loading) {
      console.log('⚠️ Already loading, ignoring loadMore request');
      return;
    }
    
    if (!hasMore) {
      console.log('⚠️ No more data available, ignoring loadMore request');
      return;
    }

    fetchPaged(baseUrl, mapper, notify);
  };

  const reset = () => {
    console.log('🔄 Pagination reset called');
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setLoading(false);
  };

  const updateItem = (id, updater) => {
    setData(prev => prev.map(item => item.id === id ? updater(item) : item));
  };

  const addItem = (newItem) => {
    setData(prev => [...prev, newItem]);
  };

  const removeItem = (id) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const addItemIfNotExists = (newItem) => {
    setData(prev => {
      const exists = prev.some(item => item.id === newItem.id);
      if (exists) {
        console.log(`⚠️ Item with id ${newItem.id} already exists, skipping`);
        return prev;
      }
      console.log(`✅ Adding new item with id ${newItem.id}`);
      return [...prev, newItem];
    });
  };

  return {
    data,
    page,
    hasMore,
    loading,
    setData,
    fetchPaged,
    loadMore,
    reset,
    updateItem,
    addItem,
    removeItem,
    addItemIfNotExists
  };
};

export default usePagination;