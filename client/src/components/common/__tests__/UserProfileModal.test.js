import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import UserProfileModal from '../UserProfileModal';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react';

const mockUser = {
    name: 'John Smith',
    email: 'test@mail.com'
};

test('should render modal if `show` is true', () => {
    const {getByTestId} = render(<UserProfileModal show={true} onClose={() => {}} logOut={() => {}} userData={mockUser} />);

    expect(getByTestId('modal')).toBeInTheDocument();
});

test('should not render modal if `show` is false', () => {
    const {getByTestId} = render(<UserProfileModal show={false} onClose={() => {}} logOut={() => {}} userData={mockUser} />);

    let modal;
    try{
        modal = getByTestId('modal');
    }catch(e){
        modal = null;
    }

    expect(modal).toBe(null);
});

test('should render user data', () => {
    const component = render(<UserProfileModal show={true} onClose={() => {}} logOut={() => {}} userData={mockUser} />);

    const name = component.getByTestId('name');
    const email = component.getByTestId('email');

    expect(name.textContent).toBe('Name: John Smith');
    expect(email.textContent).toBe('Email: test@mail.com ');
}); 

test('should call log out', () => {
    let message = '';
    const {getByTestId} = render(<UserProfileModal show={true} onClose={() => {}} logOut={() => {message='logOut clicked'}} userData={mockUser} />);

    act(() => {
        fireEvent.click(getByTestId('logOut'));
    });

    expect(message).toBe('logOut clicked')
});

test('should call close', () => {
    let message = '';

    const {getByTestId} = render(<UserProfileModal show={true} onClose={() => {message='close clicked'}} logOut={()=>{}} userData={mockUser} />);
  

    act(() => {
        fireEvent.click(getByTestId('close'));
    });

    expect(message).toBe('close clicked');
});