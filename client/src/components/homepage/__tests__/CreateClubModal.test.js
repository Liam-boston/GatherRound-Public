// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import CreateClubModal from '../CreateClubModal';
// import { collection, addDoc } from 'firebase/firestore';
// import '@testing-library/jest-dom/extend-expect';

// jest.mock('firebase/firestore', () => ({
//   collection: jest.fn(),
//   addDoc: jest.fn(),
// }));

// describe('CreateClubModal Component', () => {
//   const mockSetMessage = jest.fn();
//   const mockOnClose = jest.fn();
//   const mockCurrentUser = { uid: '123' };

//   it('should render the modal', () => {
//     render(
//       <CreateClubModal
//         show={true}
//         onClose={mockOnClose}
//         setMessage={mockSetMessage}
//         currentUser={mockCurrentUser}
//       />
//     );

//     expect(screen.getByText('Create a New Club')).toBeInTheDocument();
//   });

//   it('should create a new club on form submission', async () => {
//     addDoc.mockResolvedValueOnce({});

//     render(
//       <CreateClubModal
//         show={true}
//         onClose={mockOnClose}
//         setMessage={mockSetMessage}
//         currentUser={mockCurrentUser}
//       />
//     );

//     fireEvent.change(screen.getByPlaceholderText('Club Name'), { target: { value: 'Test Club' } });
//     fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Test Description' } });

//     fireEvent.click(screen.getByText('Create Club'));

//     await waitFor(() => expect(addDoc).toHaveBeenCalled());

//     expect(mockSetMessage).toHaveBeenCalledWith({
//       type: 'success',
//       text: 'Successfully created Test Club!',
//     });

//     expect(mockOnClose).toHaveBeenCalled();
//   });
// });
