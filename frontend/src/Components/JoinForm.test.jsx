import JoinForm from './JoinForm'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

it('set pseudo and room im form.', function() {
  render(<App />, { wrapper: MemoryRouter })
  expect(screen.getByText("RED TETRIS")).toBeInTheDocument()
})

//test form wrong pseudo et room name (empty, caractere non alpha)