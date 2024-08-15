import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import style from '../src/EditForm.module.css'

const EditForm = ({ todo, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setTime(todo.time);
    }
  }, [todo]);/*explicar esse codigo*/

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...todo, title, time });/*explicar esse codigo*/
  };

  return (
    <div className={style.form_todo}>
      <form onSubmit={handleSubmit}>
        <div className={style.list_todo} >
          <div className={style.form_control}>
            <label>
              Titulo:
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label>
              Tempo:
            </label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

          </div>
          <button className={style.buttonSave} type="submit">Salvar Edição</button>
        </div>

      </form>
    </div>
  );
};


EditForm.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired,
  }),
  onUpdate: PropTypes.func.isRequired,
};

export default EditForm;
