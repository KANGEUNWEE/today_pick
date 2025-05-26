import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const food = searchParams.get('food');
  const score = searchParams.get('score');

  const [isLoading, setIsLoading] = useState(false);

  const handleRetry = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/recommend');
      const data = await res.json();
      router.push(`/?food=${data.food}`); // 다시 index로 추천 음식 전달
    } catch  {
      alert('재추천 실패!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">🍱 추천 결과</h1>
      <p className="mb-2">✨ 음식: <strong>{food}</strong></p>
      <p className="mb-4">⭐ 별점: <strong>{score}</strong></p>

      <button
        onClick={handleRetry}
        className="bg-orange-500 text-white px-4 py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? '다시 추천 중...' : '다른 음식 추천받기'}
      </button>
    </main>
  );
}
