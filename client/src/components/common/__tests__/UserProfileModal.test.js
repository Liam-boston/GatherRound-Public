import React, { act } from 'react';
import { fireEvent, render } from '@testing-library/react';
import UserProfileModal from '../UserProfileModal';
import '@testing-library/jest-dom/extend-expect';
import Homepage from '../../homepage/Homepage';
import { getAuth } from 'firebase/auth';
import { getDocs } from 'firebase/firestore';
import { MemoryRouter } from 'react-router-dom';

// Mock Firebase Auth and Firestore
jest.mock('firebase/auth', () => require('../../../../__mocks__/firebase'));
jest.mock('firebase/firestore', () => require('../../../../__mocks__/firebase'));

const mockAuthUser = {
    uid: 'fakeUserId',
    email: 'test@mail.com'
};

const mockUserData = {
    name: 'John Smith',
    email: 'test@mail.com'
};

const mockClubs = [
    { id: 1, name: 'Chess Club' },
    { id: 2, name: 'Book Club' }
  ];

describe('User Profile Modal', () => {
    beforeEach(() => {  
        getDocs.mockResolvedValue({
            docs: mockClubs.map((club) => ({
              id: club.id,
              data: () => club,
            })),
          });
    
        const mockGetAuth = {
          onAuthStateChanged: jest.fn((callback) => {
            callback(mockAuthUser);
            return jest.fn();
          }),
        };
        
        getAuth.mockReturnValue(mockGetAuth);
    });
    
    //UT-11: Can render user profile modal
    test('should render modal if `show` is true', () => {
        const {getByTestId} = render(<UserProfileModal show={true} onClose={() => {}} logOut={() => {}} userData={mockUserData} />);
    
        expect(getByTestId('profile-modal')).toBeInTheDocument();
    });

    //UT-11: Can render user profile modal (in homepage)
    test('should open modal from Homepage', () => {
        const { getByTestId } = render(<Homepage />);
    
        fireEvent.click(getByTestId('profile-button'));
    
        expect(getByTestId('profile-modal')).toBeInTheDocument();
    });
    
    //
    test('should not render modal if `show` is false', () => {
        const {getByTestId} = render(<UserProfileModal show={false} onClose={() => {}} logOut={() => {}} userData={mockUserData} />);
    
        let modal;
        try{
            modal = getByTestId('profile-modal');
        }catch(e){
            modal = null;
        }
    
        expect(modal).toBe(null);
    });
    
    //UT-12: Can render user data in user profile modal
    test('should render user data', () => {
        const component = render(<UserProfileModal show={true} onClose={() => {}} logOut={() => {}} userData={mockUserData} />);
    
        const name = component.getByTestId('name');
        const email = component.getByTestId('email');
    
        expect(name.textContent).toBe('Name: John Smith');
        expect(email.textContent).toBe('Email: test@mail.com ');
    }); 
    
    //UT-13: Can log out from user profile modal
    test('should call log out', () => {
        let message = '';
        const {getByTestId} = render(<UserProfileModal show={true} onClose={() => {}} logOut={() => {message='logOut clicked'}} userData={mockUserData} />);
    
        fireEvent.click(getByTestId('logOut'));
    
        expect(message).toBe('logOut clicked')
    });
    
    //UT-14: Can close user profile modal
    test('should call close', () => {
        const mockOnClose = jest.fn();
    
        const {getByTestId} = render(<UserProfileModal show={true} onClose={mockOnClose} logOut={()=>{}} userData={mockUserData} />);
      
        fireEvent.click(getByTestId('profile-close'));
    
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    //UT-14: Can close user profile modal (in homepage)
    test('should close modal from Homepage', () => {
        
        const { getByTestId } = render(<Homepage/>);
      
        fireEvent.click(getByTestId('profile-button'));
        
        fireEvent.click(getByTestId('profile-close'));
    
        let modal;
        try{
            modal = getByTestId('modal');
        }catch(err){
            modal = null
        }
        expect(modal).toBe(null);
    });
});