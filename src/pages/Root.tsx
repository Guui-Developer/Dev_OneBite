import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryStore } from '@/store/categoryStore';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Root() {
  const navigate = useNavigate();
  const { selectedCategories } = categoryStore();

  useEffect(() => {
    // 선택된 카테고리가 있으면 Learn으로, 없으면 Welcome으로
    if (selectedCategories.length > 0) {
      navigate('/learn', { replace: true });
    } else {
      navigate('/welcome', { replace: true });
    }
  }, [selectedCategories, navigate]);

  return <LoadingSpinner message="로딩 중..." />;
}
