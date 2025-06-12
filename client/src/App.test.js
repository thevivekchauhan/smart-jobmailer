import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import App from './App';

const renderWithProviders = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  );
};

test('renders app without crashing', () => {
  renderWithProviders(<App />);
  expect(screen.getByRole('main')).toBeInTheDocument();
});

test('redirects to login page when not authenticated', () => {
  renderWithProviders(<App />, { route: '/' });
  expect(window.location.pathname).toBe('/login');
});
