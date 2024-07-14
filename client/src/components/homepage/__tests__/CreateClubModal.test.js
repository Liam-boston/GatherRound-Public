import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateClubModal from '../CreateClubModal';
import { setDoc, doc, db } from 'firebase/firestore';

// Command to run file
// npx jest src/components/homepage/__tests__/CreateClubModal.test.js

// Mock Firestore
jest.mock('firebase/firestore', () => require('../../../../__mocks__/firebase'));

const mockUser = {
    uid: '123',
    email: 'john.doe@example.com'
}

// UAT-13: CreateClubModal successfully adds a new club document to Firestore
test('CreateClubModal successfully adds a new club document to Firestore', async () => {
    render(<CreateClubModal show={true} onClose={() => { }} setMessage={() => { }} currentUser={{ uid: '123' }} />);

    // Fill out the form fields
    const clubNameInput = screen.getByPlaceholderText('Club Name');
    fireEvent.change(clubNameInput, { target: { value: 'Testing...anybody there?' } });

    const descriptionInput = screen.getByPlaceholderText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Yeah John we can hear you.' } });

    // Submit the form
    const createButton = screen.getByTestId('create-club-modal__submit');

    act(() => {
        fireEvent.click(createButton);
    });

    // Assert that setDoc was called with the correct arguments
    expect(setDoc).toHaveBeenCalledWith(doc(db, 'Clubs', 'Testing...anybody there?'), {
        name: 'Testing...anybody there?',
        description: 'Yeah John we can hear you.',
        admin: ['123'],
        members: [],
        createdAt: expect.any(Date),
    });
});