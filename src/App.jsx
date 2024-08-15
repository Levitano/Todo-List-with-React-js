import './App.css'
import { useEffect, useState } from 'react'
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill, BsPencil } from 'react-icons/bs'
import { v4 as uuidv4 } from 'uuid'
import Input from './components/Input'
import EditForm from './EditForm'
import Modal from '../src/components/Modal'

const API = "http://localhost:5000"

function App() {
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null); // Estado para armazenar a tarefa atual para edição

  const openModal = (todo) => {
    setCurrentTodo(todo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTodo(null);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      const res = await fetch(API + '/todos')
        .then(response => response.json())
        .then(data => data)

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
    })

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

    setTodos(todos.filter((t) => t.id !== id))
  }

  const handleEdit = async (todo) => {
    todo.done = !todo.done
    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        'Content-type': 'application/json'
      }
    }).then(response => response.json())

    setTodos((previousState) => previousState.map((t) => (t.id === data.id ? data : t)))
  }

  const handleUpdateTodo = async (updatedTodo) => {
    const data = await fetch(API + "/todos/" + updatedTodo.id, {
      method: "PUT",
      body: JSON.stringify(updatedTodo),
      headers: {
        'Content-type': 'application/json'
      }
    }).then(response => response.json())

    setTodos((previousState) => previousState.map((t) => (t.id === data.id ? data : t)))
    console.log(todos);
    closeModal()
  }

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className='App'>
      <div className="todo-header">
        <h1>React Todo</h1>
      </div>

      <div className="form-todo">
        <h2>Insira a sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <Input
            text='O que você vai fazer?'
            type='text'
            name='title'
            placeholder='Titulo da tarefa'
            handleOnchange={(e) => setTitle(e.target.value)}
            value={title || ""}
          />
          <div className="form-control">
            <Input
              text='Duração: '
              type='number'
              name='time'
              placeholder='Tempo estimado (Em hora)'
              handleOnchange={(e) => setTime(e.target.value)}
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
              <BsPencil onClick={() => openModal(todo)} />
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <EditForm todo={currentTodo} onUpdate={handleUpdateTodo} />
      </Modal>
    </div>
  )
}

export default App
