import { render, cleanup, screen, fireEvent, waitForElement } from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import List from './List'

afterEach(cleanup)

it('Testing adding & updating task functionality', async () => {
  const { getByTestId, container } = render(<List />)
  const newTaskField = getByTestId("newTaskField")
  const newTaskForm = getByTestId("newTaskForm")
  fireEvent.change(newTaskField, { target: { value: "Hello World" } })
  fireEvent.submit(newTaskForm)
  const taskItem = container.querySelector(".nestable-list > .nestable-item:nth-child(1) span:nth-child(1)")
  expect(taskItem).toHaveTextContent("Hello World")
  fireEvent.click(taskItem)
  const sidePanel = getByTestId("sidePanel")
  const updateTaskField = getByTestId("updateTaskField")
  const updateTaskForm = getByTestId("updateTaskForm")
  expect(sidePanel).toBeInTheDocument()
  fireEvent.change(updateTaskField, { target: { value: "Playing Football" } })
  fireEvent.submit(updateTaskForm)
  expect(taskItem).toHaveTextContent("Playing Football")
})

it('Testing removing redundant slashes functionality', async () => {
  const { getByTestId, container } = render(<List />)
  const newTaskForm = getByTestId("newTaskForm")
  const newTaskField = getByTestId("newTaskField")
  fireEvent.change(newTaskField, { target: { value: "Good Morning  //" } })
  fireEvent.submit(newTaskForm)
  const taskItem = container.querySelector(".nestable-list > .nestable-item:nth-child(2) span:nth-child(1)")
  expect(taskItem).toHaveTextContent("Good Morning")
})

it('Testing adding done task functionality', async () => {
  const { getByTestId, container } = render(<List />)
  const newTaskForm = getByTestId("newTaskForm")
  const newTaskField = getByTestId("newTaskField")
  fireEvent.change(newTaskField, { target: { value: "Good Evening/x" } })
  fireEvent.submit(newTaskForm)
  const taskItem = container.querySelector(".nestable-list > .nestable-item:nth-child(3) strike:nth-child(1)")
  expect(taskItem).toHaveTextContent("Good Evening")
})

it('Testing dropdown', async () => {
  const { getByTestId } = render(<List />)
  const newTaskField = getByTestId("newTaskField")
  fireEvent.change(newTaskField, { target: { value: "Cat is an animal  /" } })
  const specialsDropdown = getByTestId("specialsDropdown")
  expect(specialsDropdown).toBeInTheDocument()
})
