import { useEffect, useState } from 'react'
import axios from 'axios'
import type { AxiosError } from 'axios'

interface Food {
  code: number
  category: string
  name: string
}

export default function FoodListPage() {
  const [foods, setFoods] = useState<Food[]>([])
  const [newCode, setNewCode] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newName, setNewName] = useState('')
  const [editingCode, setEditingCode] = useState<number | null>(null)
  const [editCategory, setEditCategory] = useState('')
  const [editName, setEditName] = useState('')
  const [filterCategory, setFilterCategory] = useState('')


  const fetchFoods = async () => {
    const res = await axios.get('/api/admin/foods/list')
    setFoods(res.data.foods)
  }

  const addFood = async () => {
    if (!newCode || !newCategory || !newName) return alert('코드 or 카테고리 or 이름을 입력하세요')
    try {

      await axios.post('/api/admin/foods/list', { code: Number(newCode), category: String(newCategory), name: newName })
      setNewCode('')
      setNewCategory('')
      setNewName('')
      fetchFoods()

    }  catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>
        alert(error.response?.data?.message || '추가 실패')
    }
  }

  const deleteFood = async (code: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {

      await axios.delete(`/api/admin/foods/modify?code=${code}`)
      fetchFoods() 

    } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>
        alert(error.response?.data?.message || '삭제 실패')
    }
  }   

   const startEdit = (code: number, name: string, category: string) => {
    setEditingCode(code)
    setEditName(name)
    setEditCategory(category)
   }

  const cancelEdit = () => {
    setEditingCode(null)
    setEditCategory('')
    setEditName('')
  }

  const saveEdit = async () => {
  if (editingCode === null || !editName || !editCategory) return

  try {
    await axios.put(`/api/admin/foods/modify?code=${editingCode}`, {
      name: editName,
      category: editCategory,
    })
    cancelEdit()
    fetchFoods()

  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>
    alert(error.response?.data?.message || '수정 실패')
  }
}

  useEffect(() => {
    fetchFoods()
  }, [])

  return (
    <main style={{ padding: '2rem' }}>
      <h1>🍽 음식 목록 관리</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>카테고리 필터:</label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">전체</option>
          {[...new Set(foods.map(f => f.category))].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="코드"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />

        <input
            placeholder="카테고리 (예: 한식)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={{ marginRight: '0.5rem' }}

        />

        <input
          placeholder="음식명"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />

        <button onClick={addFood}>추가</button>
      </div>

      <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>코드</th>
            <th>카테고리</th>
            <th>음식명</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
            {foods
            .filter(food => !filterCategory || food.category === filterCategory)
            .map(({ code, name, category }) => (
              <tr key={code}>
                <td>{code}</td>
                <td>
                  {editingCode === code ? (
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                  ) : (
                    name
                  )}
                </td>
                <td>
                  {editingCode === code ? (
                    <input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
                  ) : (
                    category
                  )}
                </td>
                <td>
                  {editingCode === code ? (
                    <>
                      <button onClick={saveEdit}>저장</button>
                      <button onClick={cancelEdit}>취소</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(code, name, category)}>수정</button>
                      <button onClick={() => deleteFood(code)}>삭제</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  )
}