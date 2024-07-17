import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { addDoc, collection } from 'firebase/firestore';
import CreateMeetingModal from '../CreateMeetingModal';
import { db } from '../../../services/firebase';

// Command to run file
// npx jest src/components/clubs/__tests__/CreateMeetingModal.test.js

// Mock Firestore
jest.mock('firebase/firestore', () => require('../../../../__mocks__/firebase'));

const mockUser = {
    uid: '123',
    email: 'john.doe@example.com'
};

// Mock the setMessage and onClose functions
const setMessage = jest.fn();
const onClose = jest.fn();

// UAT-25: CreateMeetingModal successfully adds a new meeting document to Firestore
test('CreateMeetingModal successfully adds a new meeting document to Firestore', async () => {
    render(
        <CreateMeetingModal
            show={true}
            onClose={onClose}
            setMessage={setMessage}
            currentUser={mockUser}
        />
    );

    // Fill out the form fields
    const meetingNameInput = screen.getByPlaceholderText('Meeting Name');
    fireEvent.change(meetingNameInput, { target: { value: 'Test Meeting' } });

    const descriptionInput = screen.getByPlaceholderText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'This is a test meeting description.' } });

    // Submit the form
    const createButton = screen.getByTestId('create-meeting-modal__submit');
    fireEvent.click(createButton);

    // Assert that addDoc was called with the correct arguments
    await waitFor(() => {
        expect(addDoc).toHaveBeenCalledWith(collection(db, 'Meetings'), {
            name: 'Test Meeting',
            description: 'This is a test meeting description.',
            creator: [mockUser.uid],
            createdAt: expect.any(Date),
            attendees: [],
            activities: []
        });
    });

    // Assert that setMessage was called with the success message
    expect(setMessage).toHaveBeenCalledWith({ type: 'success', text: 'Successfully created Test Meeting!' });

    // Assert that onClose was called
    expect(onClose).toHaveBeenCalled();
});
