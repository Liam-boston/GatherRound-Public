import React, { act } from 'react';
import Homepage from '../Homepage';
import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for better assertions

// npx jest src/components/homepage/__tests__/Homepage.test.js

// UT-8: shows CreateClubModal when create button is clicked
// Mock CreateClubModal component
jest.mock("../CreateClubModal", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-create-club-modal" />)
}));

test('shows CreateClubModal when create button is clicked', async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );
  });

  // Find the Create Club button by its role  
  const createButton = screen.getByRole('button', { name: 'create-new' });
  
  await act(async () => {
    fireEvent.click(createButton);
  });

  // Assert that the modal is rendered or another relevant action
  const modalElement = screen.getByTestId('mock-create-club-modal');
  expect(modalElement).toBeInTheDocument();
});



// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import Homepage from '../Homepage';
// import '@testing-library/jest-dom/extend-expect';

// // Mock Firebase modules
// jest.mock('firebase/firestore');
// jest.mock('firebase/auth');

// const { getDocs, addDoc } = require('firebase/firestore');

// describe('Homepage Component', () => {
//   // Mock data
//   const mockClubs = [
//     { id: '1', name: 'Club 1' },
//     { id: '2', name: 'Club 2' },
//   ];

//   // Before each test, set up necessary mocks
//   beforeEach(() => {
//     getDocs.mockResolvedValueOnce({
//       docs: mockClubs.map(club => ({ id: club.id, data: () => club })),
//     });
//     addDoc.mockResolvedValueOnce();
//   });

//   it('should navigate to the club page when a club button is clicked', async () => {
//     render(<MemoryRouter><Homepage /></MemoryRouter>);

//     // Wait for the clubs to load
//     await waitFor(() => expect(getDocs).toHaveBeenCalled());

//     // Find and click the first club button
//     const clubButtons = screen.getAllByRole('button', { name: /Club/i });
//     fireEvent.click(clubButtons[0]);

//     // Expect navigation to Clubs page
//     expect(window.location.pathname).toBe('/Clubs');
//   });

//   it('should render and close the create club modal', async () => {
//     render(<MemoryRouter><Homepage /></MemoryRouter>);

//     // Wait for the clubs to load
//     await waitFor(() => expect(getDocs).toHaveBeenCalled());

//     // Click the create club button
//     const createButton = screen.getByText('Create Club');
//     fireEvent.click(createButton);

//     // Expect the modal to be shown
//     expect(screen.getByText('Create a New Club')).toBeInTheDocument();

//     // Click the cancel button
//     const cancelButton = screen.getByText('Cancel');
//     fireEvent.click(cancelButton);

//     // Expect the modal to be closed
//     expect(screen.queryByText('Create a New Club')).not.toBeInTheDocument();
//   });

//   it('should create a new club successfully', async () => {
//     render(<MemoryRouter><Homepage /></MemoryRouter>);

//     // Wait for the clubs to load
//     await waitFor(() => expect(getDocs).toHaveBeenCalled());

//     // Click the create club button
//     const createButton = screen.getByText('Create Club');
//     fireEvent.click(createButton);

//     // Fill in the form
//     fireEvent.change(screen.getByPlaceholderText('Club Name'), { target: { value: 'New Club' } });
//     fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'New Club Description' } });

//     // Submit the form
//     fireEvent.click(screen.getByText('Create Club'));

//     // Wait for the club to be added
//     await waitFor(() => expect(addDoc).toHaveBeenCalled());

//     // Expect a success message
//     expect(screen.getByText('Successfully created New Club!')).toBeInTheDocument();
//   });

//   it('should update the club list after a new club is created', async () => {
//     render(<MemoryRouter><Homepage /></MemoryRouter>);

//     // Wait for the clubs to load
//     await waitFor(() => expect(getDocs).toHaveBeenCalled());

//     // Click the create club button
//     const createButton = screen.getByText('Create Club');
//     fireEvent.click(createButton);

//     // Fill in the form
//     fireEvent.change(screen.getByPlaceholderText('Club Name'), { target: { value: 'New Club' } });
//     fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'New Club Description' } });

//     // Submit the form
//     fireEvent.click(screen.getByText('Create Club'));

//     // Wait for the club to be added
//     await waitFor(() => expect(addDoc).toHaveBeenCalled());

//     // Mock the updated clubs list
//     const updatedClubs = [...mockClubs, { id: '3', name: 'New Club' }];
//     getDocs.mockResolvedValueOnce({
//       docs: updatedClubs.map(club => ({ id: club.id, data: () => club })),
//     });

//     // Re-render the homepage to fetch the updated clubs list
//     render(<MemoryRouter><Homepage /></MemoryRouter>);

//     // Wait for the updated clubs list to load
//     await waitFor(() => expect(getDocs).toHaveBeenCalledTimes(2));

//     // Check if the new club is in the list
//     expect(screen.getByText('New Club')).toBeInTheDocument();
//   });
// });
