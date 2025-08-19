import { useState } from 'react'
import avatar from './assets/img/NguyenHoangAnhKhoa.jpg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://akhoadevtool2109.github.io/bio_page" target="_blank">
          <img src={avatar} className="logo" alt="Avatar of Khoa" />
        </a>
      </div>
      <h1>Nguyễn Hoàng Anh Khoa</h1>
      <div className="card">
        <p>Mã số sinh viên: 22110352</p>
      </div>
      <p className="read-the-docs">
        Sinh viên năm 4 ngành Công nghệ phần mềm
      </p>
    </>
  )
}

export default App
