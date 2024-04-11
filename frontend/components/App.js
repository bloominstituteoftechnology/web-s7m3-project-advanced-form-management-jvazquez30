// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import * as yup from "yup"
import { isValid } from 'ipaddr.js'

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.
const formSchema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required(e.usernameRequired)
    .min(3, e.usernameMin)
    .max(20, e.usernameMax),
  favLanguage: yup
    .string()
    .trim()
    .required(e.favLanguageRequired)
    .oneOf(['javascript', 'rust'], e.favLanguageOptions),
  favFood: yup
    .string()
    .required(e.favFoodRequired)
    .oneOf(['broccoli', 'spaghetti', 'pizza'], e.favFoodOptions),
  agreement: yup.boolean().required(e.agreementOptions).oneOf([true], e.agreementOptions)


})

const initialValues = () => ({
  username: '',
  favLanguage: "",
  favFood: "",
  agreement: false
})
const getInitialValues = () => ({
  username: '',
  favLanguage: "",
  favFood: "",
  agreement: ""
})

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
  const [values, setValues] = useState(initialValues())
  const [errors, setErrors] = useState(getInitialValues())
  const [success, setSuccess] = useState("")
  const [failure, setFailure] = useState("")
  const [disabled, setDisabled] = useState(false)

  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.
  useEffect(() => {
    formSchema.isValid(values).then(setDisabled)

  }, [values])

  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    let {type, name, value, checked} = evt.target
    value = type == 'checkbox' ? checked : value
    setValues({ ...values, [name]: value})
    yup.reach(formSchema, name).validate(value)
      .then(() => setErrors({...errors, [name]: ''}))
      .catch((err) => setErrors({...errors, [name]: err.errors[0]}))
  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault()
    axios.post("https://webapis.bloomtechdev.com/registration", values)
    .then(res => {
      setSuccess(res.data.message)
      setFailure()
      setValues(initialValues())
    }).catch(err => {
      setFailure(err.response.data.message)
      setSuccess()
    })

  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        {success && <h4 className="success">{success}</h4>}
        {failure && <h4 className="error">{failure}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input value={values.username} id="username" name="username" type="text" placeholder="Type Username" onChange={onChange} />
          {errors.username && <div className="validation">{errors.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input checked={values.favLanguage == "javascript" } type="radio" name="favLanguage" value="javascript" onChange={onChange} />
              JavaScript
            </label>
            <label>
              <input checked={values.favLanguage == 'rust'} type="radio" name="favLanguage" value="rust" onChange={onChange} />
              Rust
            </label>
          </fieldset>
          {errors.favLanguage && <div className="validation">{errors.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select value={values.favFood} id="favFood" name="favFood" onChange={onChange}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
         {errors.favFood && <div className="validation">{errors.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input checked={values.agreement} id="agreement" type="checkbox" name="agreement" onChange={onChange} />
            Agree to our terms
          </label>
         {errors.agreement && <div className="validation">{errors.agreement}</div>}
        </div>

        <div>
          <input type="submit" disabled={!disabled} />
        </div>
      </form>
    </div>
  )
}
