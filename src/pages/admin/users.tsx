import { useEffect, useState } from 'react'
import axios from 'axios'

interface User {
  id: number
  code: string
  name: string
  gender: string
  ageGroup: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = async () => {
    const res = await axios.get<{ users: User[] }>('/api/admin/users')
    setUsers(res.data.users)
  }

  const deleteUser = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await axios.delete(`/api/admin/users/${id}`)
      fetchUsers()
    } catch (err) {
      alert('삭제 실패')
      console.error(err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <main style={{ padding: '2rem' }}>
      <h1>👤 회원 관리</h1>
      <table border={1} cellPadding={10} style={{ marginTop: '1rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>아이디</th>
            <th>닉네임</th>
            <th>성별</th>
            <th>나이대</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, code, name, gender, ageGroup }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{code}</td>
              <td>{name}</td>
              <td>{gender}</td>
              <td>{ageGroup}</td>
              <td><button onClick={() => deleteUser(id)}>삭제</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}