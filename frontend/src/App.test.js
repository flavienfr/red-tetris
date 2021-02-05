import { render, screen } from '@testing-library/react'
import { MemoryRouter, BrowserRouter } from 'react-router-dom'
import App from './App'

export const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, { wrapper: BrowserRouter })
}

describe('Non working routes url', () => {
  function index(route){
    renderWithRouter(<App />, { route: route })
    expect(screen.getByText("RED TETRIS")).toBeInTheDocument()
  }

  it('/',() => { index('/') })
  it('/hgftghfhj',() => { index('/hgftghfhj') })
  it('/hgftghfhj[dsfds]dfs',() => { index('/hgftghfhj[dsfds]dfs') })
  it('/#hgftghfhj[dsfds]dfs',() => { index('/#hgftghfhj[dsfds]dfs') })
  it('/##fdsfd[dfds]',() => { index('/##fdsfd[dfds]') })
  it('/#[]',() => { index('/#[]') })
  it('/#k[]',() => { index('/#k[]') })
  it('/#[j]',() => { index('/#[j]') })

})
