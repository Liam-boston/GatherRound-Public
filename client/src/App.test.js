import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders page', () => {
  render(<App />);
  const mainDiv = screen.getByTestId('app');
  expect(mainDiv).toBeInTheDocument();
});
