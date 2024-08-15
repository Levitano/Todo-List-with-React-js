import style from '../components/Input.module.css'
import PropTypes from 'prop-types';





function Input({ text, type, name, placeholder, handleOnchange, value }) {
    return (

        <div className={style.form_control}>
            <label htmlFor={name}>{text}</label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={handleOnchange}
                value={value}
                required
            />


        </div>

    )
}

Input.propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    handleOnchange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default Input