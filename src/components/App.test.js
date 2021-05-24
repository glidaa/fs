import { render, cleanup, fireEvent } from '@testing-library/react'
import App from './App'

afterEach(cleanup)

it('Testing adding & updating task functionality', async () => {
  const { getByTestId, container } = render(<App />)
  const newTaskBtn = getByTestId("newTaskBtn")
  fireEvent.click(newTaskBtn)
  let taskInputField = getByTestId("taskInputField")
  fireEvent.change(taskInputField, { target: { value: "Hello World" } })
  fireEvent.keyUp(taskInputField, { key: 'Enter', code: 'Enter' })
  let taskItem = container.querySelector(".nestable-list > .nestable-item:nth-child(1) span:nth-child(2)")
  expect(taskItem).toHaveTextContent("Hello World")
  fireEvent.click(taskItem)
  taskInputField = getByTestId("taskInputField")
  fireEvent.change(taskInputField, { target: { value: "Playing Football" } })
  fireEvent.keyUp(taskInputField, { key: 'Enter', code: 'Enter' })
  taskItem = container.querySelector(".nestable-list > .nestable-item:nth-child(1) span:nth-child(2)")
  expect(taskItem).toHaveTextContent("Playing Football")
})

it('Testing removing redundant slashes functionality', async () => {
  const { getByTestId, container } = render(<App />)
  const newTaskBtn = getByTestId("newTaskBtn")
  fireEvent.click(newTaskBtn)
  const taskInputField = getByTestId("taskInputField")
  fireEvent.change(taskInputField, { target: { value: "Good Morning  //" } })
  fireEvent.keyUp(taskInputField, { key: 'Enter', code: 'Enter' })
  const taskItem = container.querySelector(".nestable-list > .nestable-item:nth-child(2) span:nth-child(2)")
  expect(taskItem).toHaveTextContent("Good Morning")
})

it('Testing adding done task functionality', async () => {
  const { getByTestId, container } = render(<App />)
  const newTaskBtn = getByTestId("newTaskBtn")
  fireEvent.click(newTaskBtn)
  const taskInputField = getByTestId("taskInputField")
  fireEvent.change(taskInputField, { target: { value: "Good Evening/x" } })
  fireEvent.keyUp(taskInputField, { key: 'Enter', code: 'Enter' })
  const taskItem = container.querySelector(".nestable-list > .nestable-item:nth-child(3) strike:nth-child(1)")
  expect(taskItem).toHaveTextContent("Good Evening")
})

it('Testing dropdown', async () => {
  const { getByTestId } = render(<App />)
  const newTaskBtn = getByTestId("newTaskBtn")
  fireEvent.click(newTaskBtn)
  const taskInputField = getByTestId("taskInputField")
  fireEvent.change(taskInputField, { target: { value: "Cat is an animal  /" } })
  const specialsDropdown = getByTestId("specialsDropdown")
  expect(specialsDropdown).toBeInTheDocument()
})
