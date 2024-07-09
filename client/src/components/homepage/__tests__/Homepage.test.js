import React, { act } from 'react';
import Homepage from '../Homepage';
import ClubDetails from '../../clubs/ClubDetails';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for better assertions

// // Mock Firebase modules
// jest.mock('firebase/firestore');
// jest.mock('firebase/auth');

// const { getDocs } = require('firebase/firestore');

// describe('Homepage Component', () => {
//   // Mock data
//   const mockClubs = [
//     { id: '1', name: 'Club 1' },
//     { id: '2', name: 'Club 2' },
//   ];

//   beforeEach(() => {
//     // Reset mocks before each test
//     getDocs.mockReset();

//     // Mock the return value of getDocs
//     getDocs.mockResolvedValue({
//       docs: mockClubs.map(club => ({ id: club.id, data: () => club })),
//     });
//   });

  // // Mock CreateClubModal component
  // jest.mock("../CreateClubModal", () => ({
  //   __esModule: true,
  //   default: jest.fn(() => <div data-testid="mock-create-club-modal" />)
  // }));

  // UT-8: CreateClubModal is shown when the create button is clicked
  test('CreateClubModal is shown when the create button is clicked', async () => {
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

     // Expect the modal to be shown
     expect(screen.getByTestId('create-club-modal__submit')).toBeInTheDocument();
  });

  // UT-9: CreateClubModal is closed when the cancel button is clicked
  it('CreateClubModal is closed when the cancel button is clicked', async () => {
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

    // Expect the modal to be shown
    expect(screen.getByTestId('create-club-modal__submit')).toBeInTheDocument();

    // Click the cancel button on the modal
    const cancelButton = screen.getByTestId('create-club-modal__cancel');
    fireEvent.click(cancelButton);

    // Expect the modal to be closed
    expect(screen.queryByTestId('create-club-modal__cancel')).not.toBeInTheDocument();
  });

  // it('should navigate to club page when a club link is clicked', async () => {
  //   render(
  //     <MemoryRouter initialEntries={['/Homepage']}>
  //       <Routes>
  //         <Route path="/Homepage" element={<Homepage />} />
  //         <Route path="/Homepage/Clubs/:id" element={<ClubDetails />} /> {/* Define the ClubDetails route */}
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   // Wait for the clubs to load
  //   await waitFor(() => expect(getDocs).toHaveBeenCalled());

  //   // Find and click the first club link
  //   const clubLinks = screen.getAllByRole('link', { name: /Club 1/i });
  //   fireEvent.click(clubLinks[0]);

  //   // Expect navigation to Clubs page
  //   expect(window.location.pathname).toBe('/Homepage/Clubs/Club 1');
  // });

  
//   it('should navigate to the club page when a club button is clicked', async () => {
//   it('should render and close the create club modal', async () => {
//   it('should create a new club successfully', async () => {
//   it('should update the club list after a new club is created', async () => {