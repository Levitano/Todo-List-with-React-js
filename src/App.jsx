import './App.css'

import { useEffect, useState } from 'react'
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs'
import { v4 as uuidv4 } from 'uuid'


const API = "http://localhost:5000"

function App() {

  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)




  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      const res = await fetch(API + '/todos').then(response => response.json()).then(data => data)

      setLoading(false)

      setTodos(res)
    }

    loadData()
  }, [])


  async function handleSubmit(e) {
    e.preventDefault()

    const todo = {
      id: uuidv4(),
      title,
      time,
      done: false
    }

    await fetch("http://localhost:5000/todos", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo)
    })/*.then(response => response.json())
      .then(data => {
        setTodos(data)
        console.log(data);
      }).catch(err => console.log(err))*/

    setTodos((previousState) => [...previousState, todo])


    setTitle("")
    setTime("")
  }

  const handleDelete = async (id) => {

    await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
      headers: {
        'Content-type': 'application/json'
      }

    })

      .then(() => {
        setTodos(todos.filter((t) => t.id !== id))
      }).catch(err => console.log(err))
  }


  const handleEdit = async (todo) => {

    todo.done = !todo.done
    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        'Content-type': 'application/json'
      }

    })
    setTodos((previousState) => previousState.map((t) => (t.id === data.id ? (t = data) : t)))
  }


  if (loading) {
    return <p>Carregando...</p>
  }





  return (
    <>
      <div className='App'>
        <div className="todo-header">
          <h1>React Todo</h1>
        </div>

        <div className="form-todo">
          <h2>Insira a sua próxima tarefa:</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor='title'>O que você vai fazer?</label>
              <input
                type='text'
                name='title'
                placeholder='Titulo da tarefa'
                onChange={(e) => setTitle(e.target.value)}
                value={title || ""}
                required
              />

            </div>

            <div className="form-control">

              <label htmlFor='time'>Duração:</label>
              <input
                type='number'
                name='time'
                placeholder='Tempo estimado (Em hora)'
                onChange={(e) => setTime(e.target.value)}
                value={time || ""}

              />

            </div>
            <input type='submit' value='Enviar' />
          </form>
        </div>

        <div className="list-todo">
          <h2>Lista de Tarefa:</h2>
          {todos.length === 0 && <p>Não há tarefa </p>}
          {todos.map((todo) => (
            <div className="todo" key={todo.id}>
              <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
              <p>Duração: {todo.time + 'H'}</p>
              <div className="actions">
                <span onClick={() => handleEdit(todo)}>
                  {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}

                </span>

                <BsTrash onClick={() => handleDelete(todo.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  )
}

export default App
